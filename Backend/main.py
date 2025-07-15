from fastapi import FastAPI
from routes.blood_pressure import router as bp_router
from routes.sleep_stages import router as sleep_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title = "Health Monitoring API",
              description = "Monitors blood pressure data")
app.include_router(bp_router)
app.include_router(sleep_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to your local IP or domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#uvicorn main:app --reload