# routes/blood_pressure.py
from fastapi import APIRouter
import models.health_data_model as models
import json
from pathlib import Path

router = APIRouter()

DATA_FILE = Path("data/blood_pressure.json")

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

@router.get("/timeseries", response_model=models.TimeEntry)
def get_timeseries():
    data = get_raw_data()
    timeseries = data['timeseries'][0]
    return timeseries


@router.get("/blood-pressure", response_model=models.BloodPressureData)
def get_blood_pressure():
    with open(DATA_FILE) as f:
        data = json.load(f)
    bp = data['timeseries'][0]['data']
    return bp