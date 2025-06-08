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


@router.get("/timeseries", response_model = models.TimeEntry)
def get_timeseries():
    data = get_raw_data()
    timeseries = data['timeseries'][0]
    return timeseries


@router.get("/blood-pressure", response_model = models.BloodPressureData)
def get_blood_pressure():
    with open(DATA_FILE) as f:
        data = json.load(f)
    bp = data['timeseries'][0]['data']
    return bp
    
@router.get("/plot")
def plot():
    models.generate_mock_bp_json()
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



