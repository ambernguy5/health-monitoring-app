from fastapi import APIRouter, Response
import models.health_data_model as models
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")  #Disable GUI rendering
import matplotlib.pyplot as plt
from io import BytesIO

router = APIRouter()

DATA_FILE = Path("root/jane_doe/20250605/blood_pressure.json")

@router.get("/raw-data", response_model = models.HealthData)
def get_raw_data():
    with open(DATA_FILE) as f: 
        raw_data = json.load(f)
    return raw_data


@router.get("/timeseries", response_model = list[models.TimeEntry])
def get_timeseries():
    data = get_raw_data()
    return data['timeseries']

@router.get("/blood-pressure", response_model = list[models.BloodPressureData])
def get_all_blood_pressure():
    with open(DATA_FILE) as f:
        data = json.load(f)
    
    all_bp = [entry['data'] for entry in data['timeseries']]
    return all_bp
    
@router.get("/plot")
def plot():
    models.generate_mock_bp_json('alice_jane', '20250609')
    raw_data = get_raw_data()

    # list of each systolic, diastolic, average bpm values
    times = [timepoint['time'] for timepoint in raw_data['timeseries']]
    systolic = [timepoint['data']['systolic'] for timepoint in raw_data['timeseries']]
    diastolic = [timepoint['data']['diastolic'] for timepoint in raw_data['timeseries']]
    average = [timepoint['data']['average'] for timepoint in raw_data['timeseries']]
    
    #times, systolic, diastolic, average = models.generate_mock_bp_lists()

    plt.figure(figsize = (15, 7))
    plt.plot(times, systolic, label = 'Systolic', marker = 'o', color = 'darkslateblue')
    plt.plot(times, diastolic, label = 'Diastolic', marker = 'o', color = 'cornflowerblue')
    plt.plot(times, average, label = 'Average', linestyle = '--', color = 'mediumpurple')

    plt.xlabel('Time')
    plt.ylabel('Blood Pressure (mmHg)')
    plt.title('Blood Pressure Over Time')
    plt.xticks(rotation = 45, fontsize = 8)
    plt.yticks(fontsize = 8)
    plt.legend()
    plt.tight_layout()

    # Save plot to memory buffer
    buf = BytesIO()
    plt.savefig(buf, format = 'png')
    buf.seek(0)
    plt.close()

    return Response(content = buf.getvalue(), media_type = "image/png")

@router.get("/notification")
def bpm_notif():
    data = get_raw_data()

    times = [timepoint['time'] for timepoint in data['timeseries']]
    systolic = [timepoint['data']['systolic'] for timepoint in data['timeseries']]
    diastolic = [timepoint['data']['diastolic'] for timepoint in data['timeseries']]
    
    # thresholds for systolic and diastolic bpm
    # still need to figure out continuous looping of notifs?
    threshold = 'Normal'
    for i in range(len(times)):
        if systolic[i] < 120 and diastolic[i] < 80:
            threshold = f"Normal at time {times[i]}"
        elif systolic[i] in range(120, 130) and diastolic[i] < 80:
            threshold = 'Elevated'
        elif systolic[i] in range(130, 140) or diastolic[i] in range(80, 89):
            threshold = 'Hypertension Stage 1'
        elif systolic[i] >= 140 or diastolic[i] >= 90:
            threshold = 'Hypertension Stage 2'
    return threshold


