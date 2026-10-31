import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_absolute_error, r2_score
import joblib
import os

def train():
    # Load dataset
    csv_path = 'data/student_placement_data.csv'
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}. Please run generate_data.py first.")
        
    df = pd.read_csv(csv_path)

    # Features and Targets
    features = ['cgpa', 'backlogs', 'dsa', 'communication', 'aptitude', 'projects', 'internships', 'tier']
    X = df[features]
    y_placed = df['placed']
    y_salary = df['salary']

    # 1. Train Placement Status Classifier
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X, y_placed, test_size=0.2, random_state=42)
    
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X_train_c, y_train_c)
    
    y_pred_c = clf.predict(X_test_c)
    accuracy = accuracy_score(y_test_c, y_pred_c)
    print(f"Classification Model (Placement) Accuracy: {accuracy:.4f}")

    # 2. Train Salary Regressor (train on all or only placed? Let's train on all to get potential packages)
    X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X, y_salary, test_size=0.2, random_state=42)
    
    reg = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    reg.fit(X_train_r, y_train_r)
    
    y_pred_r = reg.predict(X_test_r)
    mae = mean_absolute_error(y_test_r, y_pred_r)
    r2 = r2_score(y_test_r, y_pred_r)
    print(f"Regression Model (Salary) MAE: {mae:.4f} LPA")
    print(f"Regression Model (Salary) R2 Score: {r2:.4f}")

    # Extract feature importance from classifier
    feature_importances = clf.feature_importances_
    importance_map = dict(zip(features, feature_importances))
    print("Feature Importances:", importance_map)

    # Save models together
    model_payload = {
        'classifier': clf,
        'regressor': reg,
        'features': features,
        'importance': importance_map
    }
    
    joblib.dump(model_payload, 'trained_model.pkl')
    print("Models and payload successfully saved to trained_model.pkl")

if __name__ == '__main__':
    train()
