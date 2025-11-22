import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import pickle
import sys

# Correct project root
PROJECT_ROOT = os.path.dirname(
                  os.path.dirname(
                    os.path.dirname(
                      os.path.dirname(os.path.abspath(__file__)))
                  )
               )
sys.path.append(PROJECT_ROOT)

from app.utils.preprocess_url import prepare_url_for_model

# Paths
DATA_PATH = os.path.join(PROJECT_ROOT, "urls.csv")
MODEL_DIR = os.path.join(PROJECT_ROOT, "app", "model", "url_model")
MODEL_PATH = os.path.join(MODEL_DIR, "url_model.pkl")

def train_url_model():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)

    # MULTI-CLASS LABEL MAPPING
    label_map = {
        "benign": 0,
        "phishing": 1,
        "malware": 2,
        "defacement": 3
    }

    df["label"] = df["type"].map(label_map)

    print("Extracting features...")
    feature_rows = []
    labels = []

    for _, row in df.iterrows():
        features = prepare_url_for_model(row["url"])
        if features.empty:
            continue
        feature_rows.append(features.iloc[0].to_dict())
        labels.append(row["label"])

    X = pd.DataFrame(feature_rows)
    y = pd.Series(labels)

    # Train-Test Split
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Training model...")
    model = RandomForestClassifier(
        n_estimators=500,
        max_depth=None,
        class_weight='balanced',
        random_state=42
    )
    model.fit(X_train, y_train)

    # Validation
    y_pred = model.predict(X_val)
    print("\nValidation Report:\n")
    print(classification_report(
        y_val,
        y_pred,
        target_names=["benign", "phishing", "malware", "defacement"]
    ))

    # Save model
    os.makedirs(MODEL_DIR, exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print(f"\nURL model trained and saved as {MODEL_PATH}")

if __name__ == "__main__":
    train_url_model()
