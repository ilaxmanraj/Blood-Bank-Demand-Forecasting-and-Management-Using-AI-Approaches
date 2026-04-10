import mysql.connector
from mysql.connector import Error


def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Mamathasai@123",
            database="blood_bank_ai",
            charset="utf8mb4"
        )

        return conn

    except Error as e:
        print("Database connection failed:", e)
        raise