# routes/blood_pressure.py
from fastapi import APIRouter
from models.health_data_model import HealthData
import json
from pathlib import Path

router = APIRouter()

DATA_FILE = Path("data/blood-pressure.json")

@router.get("/blood-pressure", response_model=HealthData)
def get_blood_pressure():
    with open(DATA_FILE) as f:
        raw_data = json.load(f)
    return raw_data