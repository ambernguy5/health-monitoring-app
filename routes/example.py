# routes/example.py
from fastapi import APIRouter
from models.example_model import Item

router = APIRouter()

@router.post("/items/")
def create_item(item: Item):
    return {"received_item": item}