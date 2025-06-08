from fastapi import FastAPI
from routes.blood_pressure import router as bp_router

app = FastAPI(title = "Health Monitoring API",
              descriptionn = "Moniotors blood pressure data")
app.include_router(bp_router)

#uvicorn main:app --reload