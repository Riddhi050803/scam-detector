import os
import pickle
import sys

# --- Correct project root: backend folder ---
PROJECT_ROOT = os.path.dirname(
                  os.path.dirname(
                    os.path.dirname(
                      os.path.dirname(os.path.abspath(__file__)))
                  )
               )
sys.path.append(PROJECT_ROOT)

# --- Paths ---
MODEL_DIR = os.path.join(PROJECT_ROOT, "app", "model", "url_model")
MODEL_PATH = os.path.join(MODEL_DIR, "url_model.pkl")

def load_url_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"URL model not found at {MODEL_PATH}. Please train it first."
        )
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    return model
