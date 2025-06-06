# main.py
from fastapi import FastAPI
from routes import example

app = FastAPI()
app.include_router(example.router)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}
