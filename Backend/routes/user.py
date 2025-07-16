from fastapi import APIRouter
import models.health_data_model as models
import json
from pathlib import Path

router = APIRouter()

DATA_FILE = Path("root/jane_doe/20250605/blood_pressure.json")

@router.get("/raw-data", response_model=models.HealthData)
def get_raw_data():
    with open(DATA_FILE) as f: 
        raw_data = json.load(f)
    return raw_data

@router.get("/metadata", response_model=models.Metadata)
def get_metadata():
    data = get_raw_data()
    metadata = data['metadata']
    return metadata


