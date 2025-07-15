from fastapi import APIRouter, Response
import models.health_data_model as models
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")  #Disable GUI rendering
import matplotlib.pyplot as plt
from io import BytesIO

router = APIRouter()

DATA_FILE = Path("root/jane_doe/20250605/sleep_stages.json")

@router.get("/raw-data", response_model = models.HealthData)
def get_raw_data():
    with open(DATA_FILE) as f: 
        raw_data = json.load(f)
    return raw_data


@router.get("/sleep/timeseries", response_model = list[models.SleepTimeEntry])
def get_timeseries():
    data = get_raw_data()
    return data['timeseries']

@router.get("/sleep-stages", response_model = list[models.SleepData])
def get_sleep_stages():
    with open(DATA_FILE) as f:
        data = json.load(f)
    
    all_sleep = [entry['data'] for entry in data['timeseries']]
    return all_sleep
    
