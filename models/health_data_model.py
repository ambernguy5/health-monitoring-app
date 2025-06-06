# models/health_data_model.py
from pydantic import BaseModel
from typing import List, Literal
from datetime import date

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
    healthDomain: Literal["blood-pressure", "sleep-stages"]
    date: str  # or date if formatted properly

class HealthData(BaseModel):
    metadata: Metadata
    timeseries: List[TimeEntry]