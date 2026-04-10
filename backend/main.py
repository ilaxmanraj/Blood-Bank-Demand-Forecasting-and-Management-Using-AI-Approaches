from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from database import get_db_connection
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional
from predictor import predict_blood_demand
from apscheduler.schedulers.background import BackgroundScheduler

app = FastAPI()

# ================= CORS =================

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= JWT CONFIG =================

SECRET_KEY = "bloodbanksecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ================= PASSWORD HELPERS =================

def safe_password(password: str):
    return password.encode("utf-8")[:72].decode("utf-8", "ignore")


def hash_password(password: str):
    return pwd_context.hash(safe_password(password))


def verify_password(password: str, hashed: str):
    try:
        return pwd_context.verify(safe_password(password), hashed)
    except Exception:
        return False


# ================= MODELS =================

class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: str = "DONOR"


class LoginRequest(BaseModel):
    email: str
    password: str


class DonorRegisterRequest(BaseModel):
    name: str
    blood_group: str
    age: int
    gender: str
    city: str
    contact_number: str
    email: Optional[str] = None


class BloodRequestModel(BaseModel):
    requester_name: str
    blood_group: str
    units_required: int
    hospital: str


class InventoryAdd(BaseModel):
    blood_group: str
    units: int
    expiry_date: str


class PredictionInput(BaseModel):
    day: int

class DonateRequest(BaseModel):
    donor_id: int

# ================= AUTH =================

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")

        if email is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {"email": email, "role": role}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def admin_required(user=Depends(get_current_user)):
    if user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ================= BASIC =================

@app.get("/")
def home():
    return {"message": "Blood Bank AI Backend Running"}


# ================= REGISTER =================

@app.post("/register")
def register_user(data: RegisterRequest):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM users WHERE email=%s", (data.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(data.password)

    cursor.execute(
        """
        INSERT INTO users (name,email,phone,password,role)
        VALUES (%s,%s,%s,%s,%s)
        """,
        (data.name, data.email, data.phone, hashed_password, data.role)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "User registered successfully"}


# ================= LOGIN =================

@app.post("/login")
def login_user(data: LoginRequest):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (data.email,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    token = jwt.encode(
        {
            "sub": user["email"],
            "role": user["role"],
            "exp": expire
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
        "name": user["name"]
    }


# ================= DONORS =================

@app.post("/donor/register")
def register_donor(data: DonorRegisterRequest):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO donors
        (name,blood_group,age,gender,city,contact_number,email)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        """,
        (
            data.name,
            data.blood_group,
            data.age,
            data.gender,
            data.city,
            data.contact_number,
            data.email
        )
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Donor registered successfully"}


@app.get("/donors")
def get_donors():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM donors")
    donors = cursor.fetchall()

    cursor.close()
    conn.close()

    return donors


# ================= INVENTORY =================

@app.post("/inventory/add")
def add_inventory(data: InventoryAdd, admin=Depends(admin_required)):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO blood_inventory (blood_group,units,expiry_date) VALUES (%s,%s,%s)",
        (data.blood_group, data.units, data.expiry_date)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Inventory updated"}


@app.get("/inventory")
def view_inventory():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM blood_inventory")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


# ================= EXPIRY ALERTS =================

@app.get("/admin/expiry-alerts")
def get_expiry_alerts(admin=Depends(admin_required)):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    today = datetime.today().date()
    threshold = today + timedelta(days=3)

    cursor.execute(
        """
        SELECT id, blood_group, units, expiry_date
        FROM blood_inventory
        WHERE expiry_date <= %s
        ORDER BY expiry_date ASC
        """,
        (threshold,)
    )

    data = cursor.fetchall()

    alerts = []

    for item in data:
        expiry = item["expiry_date"]

        if expiry < today:
            status = "EXPIRED"
        else:
            status = "EXPIRING_SOON"

        alerts.append({
            "id": item["id"],
            "blood_group": item["blood_group"],
            "units": item["units"],
            "expiry_date": expiry,
            "status": status
        })

    cursor.close()
    conn.close()

    return {"alerts": alerts}


# ================= STORE EXPIRY ALERTS =================

def store_expiry_alerts():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    today = datetime.today().date()
    threshold = today + timedelta(days=3)

    cursor.execute(
        "SELECT * FROM blood_inventory WHERE expiry_date <= %s",
        (threshold,)
    )

    results = cursor.fetchall()

    for item in results:
        expiry = item["expiry_date"]

        if expiry < today:
            status = "EXPIRED"
            message = f"Blood {item['blood_group']} is EXPIRED"
        else:
            status = "EXPIRING_SOON"
            message = f"Blood {item['blood_group']} expiring soon"

        cursor.execute(
            "SELECT id FROM alerts WHERE blood_id=%s AND status=%s",
            (item["id"], status)
        )

        if not cursor.fetchone():
            cursor.execute(
                """
                INSERT INTO alerts (blood_id, blood_group, message, status)
                VALUES (%s,%s,%s,%s)
                """,
                (item["id"], item["blood_group"], message, status)
            )

    conn.commit()
    cursor.close()
    conn.close()


# ================= ALERTS API =================

@app.get("/admin/alerts")
def get_all_alerts(admin=Depends(admin_required)):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM alerts ORDER BY created_at DESC")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


# ================= REQUESTS =================
# ================= BLOOD REQUEST (WITH PRIORITY) =================

@app.post("/request-blood")
def request_blood(data: BloodRequestModel, user=Depends(get_current_user)):

    conn = get_db_connection()
    cursor = conn.cursor()

    # 🔥 AUTO PRIORITY LOGIC
    if data.units_required >= 5:
        priority = "HIGH"
    elif data.units_required >= 2:
        priority = "NORMAL"
    else:
        priority = "LOW"

    cursor.execute(
        """
        INSERT INTO blood_requests
        (requester_name,blood_group,units_required,hospital,status,priority)
        VALUES (%s,%s,%s,%s,'PENDING',%s)
        """,
        (
            data.requester_name,
            data.blood_group,
            data.units_required,
            data.hospital,
            priority
        )
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {
        "message": f"Blood request submitted ({priority} priority)"
    }


@app.get("/requests")
def view_requests(user=Depends(get_current_user)):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT * FROM blood_requests
        ORDER BY 
            FIELD(priority, 'HIGH', 'NORMAL', 'LOW'),
            created_at DESC
        """
    )

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data
# ================= AI PREDICTION =================

@app.post("/predict-demand")
def predict_demand(data: PredictionInput):

    prediction = predict_blood_demand(data.day)

    return {"predicted_demand": prediction}


# ================= SHORTAGE ALERTS =================

@app.get("/shortage-alerts")
def shortage_alerts():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT blood_group,units FROM blood_inventory WHERE units < 10"
    )

    alerts = cursor.fetchall()

    cursor.close()
    conn.close()

    return alerts


# ================= SCHEDULER =================

scheduler = BackgroundScheduler()
scheduler.add_job(store_expiry_alerts, 'interval', hours=24)
scheduler.start()


# ================= DONATE BLOOD (90-DAY RULE) =================

@app.post("/donor/donate")
def donate_blood(data: DonateRequest):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT last_donation_date, name FROM donors WHERE id=%s",
        (data.donor_id,)
    )

    donor = cursor.fetchone()

    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")

    today = datetime.today().date()

    last_date = donor["last_donation_date"]

    # ✅ FIRST TIME DONOR
    if last_date is None:
        cursor.execute(
            "UPDATE donors SET last_donation_date=%s WHERE id=%s",
            (today, data.donor_id)
        )
        conn.commit()

        return {
            "message": f"{donor['name']} donated successfully (First Donation)"
        }

    # ✅ CHECK 90-DAY RULE
    days_passed = (today - last_date).days

    if days_passed < 90:
        remaining = 90 - days_passed

        return {
            "message": f"Not eligible. Donate after {remaining} days"
        }

    # ✅ ALLOWED
    cursor.execute(
        "UPDATE donors SET last_donation_date=%s WHERE id=%s",
        (today, data.donor_id)
    )

    conn.commit()

    return {
        "message": f"{donor['name']} donated successfully"
    }


@app.post("/request/approve")
def approve_request(request_id: int, admin=Depends(admin_required)):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE blood_requests SET status='APPROVED' WHERE id=%s",
        (request_id,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Request approved"}


@app.post("/request/reject")
def reject_request(request_id: int, admin=Depends(admin_required)):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE blood_requests SET status='REJECTED' WHERE id=%s",
        (request_id,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Request rejected"}