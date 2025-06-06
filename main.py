# main.py
from fastapi import FastAPI
from routes import blood_pressure

app = FastAPI()
app.include_router(blood_pressure.router)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}
