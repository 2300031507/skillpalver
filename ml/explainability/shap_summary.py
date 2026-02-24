import joblib
import shap
import pandas as pd
from pathlib import Path


def load_model_and_data(model_path: str, data_path: str):
    model = joblib.load(model_path)
    df = pd.read_csv(data_path)
    X = df[["attendance_percent", "engagement_score", "coding_consistency", "inactivity_days"]]
    return model, X


def compute_shap_summary(model, X):
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)
    importance = X.columns.to_list()
    return {"features": importance, "values_shape": [len(shap_values), len(X)]}


if __name__ == "__main__":
    base = Path(__file__).resolve().parent.parent
    model_path = str(base / "artifacts" / "academic_risk_model.joblib")
    data_path = str(base / "data" / "student_features.csv")
    model, X = load_model_and_data(model_path, data_path)
    summary = compute_shap_summary(model, X)
    print(summary)

