from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from model import predict

app = FastAPI(
    title="Health Risk ML Service",
    description="ML-powered risk prediction microservice",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    symptoms: list[str]

class HealthResponse(BaseModel):
    status: str
    service: str

@app.get("/health", response_model=HealthResponse)
def health():
    return {"status": "ok", "service": "ml-service"}

@app.post("/predict")
def predict_risk(request: PredictRequest):
    if not request.symptoms:
        raise HTTPException(status_code=400, detail="At least one symptom required")

    if len(request.symptoms) > 20:
        raise HTTPException(status_code=400, detail="Maximum 20 symptoms allowed")

    result = predict(request.symptoms)
    return result