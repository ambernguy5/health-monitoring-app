# main.py
from fastapi import FastAPI
from routes import blood_pressure

app = FastAPI(title="Health Monitoring API",
              description="Moniotors blood pressure data")
app.include_router(blood_press