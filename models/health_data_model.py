from pydantic import BaseModel
from datetime import datetime, timedelta
from random import randint

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