from typing import Tuple
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from xgboost import XGBClassifier
import joblib


def load_feature_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    return df


def prepare_datasets(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    X = df[["attendance_percent", "engagement_score", "coding_consistency", "inactivity_days"]]
    y = df["risk_level"]
    return X, y


def train_academic_risk_model(X, y):
    model = XGBClassifier(
        max_depth=4,
        n_estimators=200,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="multi:softprob",
        num_class=3,
    )
    model.fit(X, y)
    return model


def evaluate_model(model, X, y):
    y_pred = model.predict(X)
    report = classification_report(y, y_pred, output_dict=True)
    return report


def run_training(input_csv: str, output_path: str):
    df = load_feature_data(input_csv)
    X, y = prepare_datasets(df)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    model = train_academic_risk_model(X_train, y_train)
    report = evaluate_model(model, X_test, y_test)
    joblib.dump(model, output_path)
    return report


if __name__ == "__main__":
    report = run_training("data/student_features.csv", "artifacts/academic_risk_model.joblib")
    print(report)

