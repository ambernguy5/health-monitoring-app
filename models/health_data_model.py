from pydantic import BaseModel
from datetime import datetime, timedelta
from random import randint
from pathlib import Path
import json

class BloodPressureData(BaseModel):
    systolic: int
    diastolic: int
    average: int

class TimeEntry(BaseModel):
    time: str  # hhmmss
    duration: int
    data: BloodPressureData

class Metadata(BaseModel):
    username: str
    healthDomain: str
    date: str

class HealthData(BaseModel):
    metadata: Metadata
    timeseries: list[TimeEntry]

def generate_mock_bp_lists():
    start_time = datetime.strptime("08:00:00", "%H:%M:%S")

    times = []
    systolic_readings = []
    diastolic_readings = []
    average_readings = []

    for i in range(61):  #8:00 to 9:00
        current_time = (start_time + timedelta(minutes = i)).strftime("%H:%M:%S")
        systolic = randint(100, 140)
        diastolic = randint(60, 100)
        average = round((systolic + diastolic) / 2)

        times.append(current_time)
        systolic_readings.append(systolic)
        diastolic_readings.append(diastolic)
        average_readings.append(average)

    return times, systolic_readings, diastolic_readings, average_readings

def generate_mock_bp_json(username="jane_doe", date="20250605"):
    start_time = datetime.strptime("08:00:00", "%H:%M:%S")
    timeseries = []

    for i in range(61):  # from 8:00 to 9:00
        current_time = (start_time + timedelta(minutes=i)).strftime("%H%M%S")
        systolic = randint(100, 140)
        diastolic = randint(60, 100)
        average = round((systolic + diastolic) / 2)

        entry = {
            "time": current_time,
            "duration": 60,
            "data": {
                "systolic": systolic,
                "diastolic": diastolic,
                "average": average
            }
        }
        timeseries.append(entry)

    health_data = {
        "metadata": {
            "username": username,
            "healthDomain": "blood-pressure",
            "date": date
        },
        "timeseries": timeseries
    }

    output_path = Path(f"root/{username}/{date}/blood_pressure.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)  # ensure directories exist

    with open(output_path, "w") as f:
        json.dump(health_data, f, indent=2)

    return output_path