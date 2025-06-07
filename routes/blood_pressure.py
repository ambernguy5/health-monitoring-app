# routes/blood_pressure.py
from fastapi import APIRouter
import models.health_data_model as models
import json
from pathlib import Path
import matplotlib as plt

router = APIRouter()

DATA_FILE = Path("data/blood_pressure.json")

@router.get("/raw-data", response_model=models.HealthData)
def get_raw_data():
    with open(DATA_FILE) as f: 
        raw_data = json.load(f)
    return raw_data

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

@router.get("/plot", repsonse_model=models.Plot)
def plot():
    raw_data = get_raw_data()
    # list of each systolic, diastolic, average bpm values
    times = [timepoint['time'] for timepoint in raw_data['timeseries']]
    systolic = [timepoint['data']['systolic'] for timepoint in raw_data['timeseries']]
    diastolic = [timepoint['data']['diastolic'] for timepoint in raw_data['timeseries']]
    average = [timepoint['data']['diastolic'] for timepoint in raw_data['timeseries']]

    plt.figure(figsize=(10, 6))
    plt.plot(times, average, label = 'Average Blood Pressure')
    plt.xlabel('Time')
    plt.ylabel('BPM')

    plt.tight_layout()
    plt.show()
    



