from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import pandas as pd
import numpy as np
import joblib
import os
import shap

app = FastAPI(title="PlacementIQ ML Prediction Service", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store model payload and explainers
model_payload = None
explainer_clf = None
explainer_reg = None

# Load model on startup
@app.on_event("startup")
def load_model():
    global model_payload, explainer_clf, explainer_reg
    model_path = "trained_model.pkl"
    if not os.path.exists(model_path):
        print(f"Warning: {model_path} not found. Running server without loaded model. Please train model first.")
        return
    try:
        model_payload = joblib.load(model_path)
        explainer_clf = shap.TreeExplainer(model_payload['classifier'])
        explainer_reg = shap.TreeExplainer(model_payload['regressor'])
        print("Model and SHAP explainers loaded successfully")
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

class ShapContribution(BaseModel):
    feature: str
    studentValue: float
    impact: float
    direction: str

class ExplanationResponse(BaseModel):
    probability: float
    prediction: int
    confidence: float
    expectedSalary: float
    baseProbability: float
    baseSalary: float
    placementContributions: List[ShapContribution]
    salaryContributions: List[ShapContribution]

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model_payload is not None,
        "shap_ready": explainer_clf is not None and explainer_reg is not None
    }

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

@app.post("/explain", response_model=ExplanationResponse)
def explain(input_data: PredictionInput):
    global model_payload, explainer_clf, explainer_reg
    if model_payload is None:
        raise HTTPException(status_code=503, detail="ML model is not loaded on server. Please train the model.")

    try:
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

        input_df = pd.DataFrame([input_dict], columns=model_payload['features'])

        clf = model_payload['classifier']
        reg = model_payload['regressor']

        # Predictions
        probs = clf.predict_proba(input_df)[0]
        probability = float(probs[1])
        prediction = int(clf.predict(input_df)[0])
        confidence = float(probs[prediction])
        expected_salary = float(reg.predict(input_df)[0])

        # Initialize explainers if not already loaded
        if explainer_clf is None:
            explainer_clf = shap.TreeExplainer(clf)
        if explainer_reg is None:
            explainer_reg = shap.TreeExplainer(reg)

        # SHAP calculation for classification
        shap_c = explainer_clf.shap_values(input_df)
        ev_c = explainer_clf.expected_value
        base_prob = float(ev_c[1]) if hasattr(ev_c, '__len__') and len(ev_c) > 1 else float(ev_c)

        if hasattr(shap_c, 'shape') and len(shap_c.shape) == 3:
            c_vals = shap_c[0, :, 1]
        elif isinstance(shap_c, list) and len(shap_c) > 1:
            c_vals = shap_c[1][0]
        else:
            c_vals = shap_c[0]

        # SHAP calculation for regression (salary)
        shap_r = explainer_reg.shap_values(input_df)
        ev_r = explainer_reg.expected_value
        base_salary = float(ev_r[0]) if hasattr(ev_r, '__len__') else float(ev_r)
        r_vals = shap_r[0]

        placement_contributions = []
        salary_contributions = []

        for i, feat in enumerate(model_payload['features']):
            val = float(input_dict[feat])
            c_imp = float(c_vals[i])
            placement_contributions.append(ShapContribution(
                feature=feat,
                studentValue=val,
                impact=c_imp,
                direction='positive' if c_imp >= 0 else 'negative'
            ))
            r_imp = float(r_vals[i])
            salary_contributions.append(ShapContribution(
                feature=feat,
                studentValue=val,
                impact=r_imp,
                direction='positive' if r_imp >= 0 else 'negative'
            ))

        placement_contributions.sort(key=lambda x: abs(x.impact), reverse=True)
        salary_contributions.sort(key=lambda x: abs(x.impact), reverse=True)

        return ExplanationResponse(
            probability=probability,
            prediction=prediction,
            confidence=confidence,
            expectedSalary=expected_salary,
            baseProbability=base_prob,
            baseSalary=base_salary,
            placementContributions=placement_contributions,
            salaryContributions=salary_contributions
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation calculation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
