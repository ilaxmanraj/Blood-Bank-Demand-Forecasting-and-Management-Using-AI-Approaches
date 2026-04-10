import numpy as np
from sklearn.linear_model import LinearRegression

# Sample training data (day vs blood demand)
days = np.array([1,2,3,4,5,6,7]).reshape(-1,1)

demand = np.array([50,55,53,60,62,65,70])

model = LinearRegression()
model.fit(days, demand)


def predict_blood_demand(day:int):

    prediction = model.predict([[day]])

    return round(float(prediction[0]),2)