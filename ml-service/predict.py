from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
import joblib
import os

app = FastAPI(title="PlacementIQ ML Prediction Service", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store model payload
model_payload = None

# Load model on startup
@app.on_event("startup")
def load_model():
    global model_payload
    model_path = "trained_model.pkl"
    if not os.path.exists(model_path):
        print(f"Warning: {model_path} not found. Running server without loaded model. Please train model first.")
        return
    try:
        model_payload = joblib.load(model_path)
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {str(e)}")

class PredictionInput(BaseModel):
    cgpa: float = Field(..., ge=0.0, le=10.0, description="Cumulative GPA")
    backlogs: int = Field(..., ge=0, description="Number of active backlogs")
    dsa: int = Field(..., ge=0, le=100, description="DSA test score")
    communication: int = Field(..., ge=0, le=100, description="Communication score")
    aptitude: int = Field(..., ge=0, le=100, description="Aptitude score")
    projects: int = Field(..., ge=0, description="Number of projects completed")
    internships: int = Field(..., ge=0, description="Number of internships completed")
    tier: int = Field(..., ge=1, le=3, description="College tier classification")

class PredictionResponse(BaseModel):
    probability: float
    prediction: int
    confidence: float
    expectedSalary: float
    skillImportance: dict

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model_payload is not None}

@app.post("/predict", response_model=PredictionResponse)
def predict(input_data: PredictionInput):
    global model_payload
    if model_payload is None:
        raise HTTPException(status_code=503, detail="ML model is not loaded on server. Please train the model.")

    try:
        # Convert Pydantic input to dict matching trained features
        input_dict = {
            'cgpa': input_data.cgpa,
            'backlogs': input_data.backlogs,
            'dsa': input_data.dsa,
            'communication': input_data.communication,
            'aptitude': input_data.aptitude,
            'projects': input_data.projects,
            'internships': input_data.internships,
            'tier': input_data.tier
        }

        # Create DataFrame
        input_df = pd.DataFrame([input_dict], columns=model_payload['features'])

        clf = model_payload['classifier']
        reg = model_payload['regressor']
        importance = model_payload['importance']

        # Class predictions
        probs = clf.predict_proba(input_df)[0]
        # Probability of class 1 (Placed)
        probability = float(probs[1])
        prediction = int(clf.predict(input_df)[0])
        
        # Confidence score (probability of the predicted class)
        confidence = float(probs[prediction])

        # Salary prediction
        expected_salary = float(reg.predict(input_df)[0])

        return PredictionResponse(
            probability=probability,
            prediction=prediction,
            confidence=confidence,
            expectedSalary=expected_salary,
            skillImportance=importance
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
