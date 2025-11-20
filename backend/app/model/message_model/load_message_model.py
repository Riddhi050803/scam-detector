import pickle
import os

def load_message_model():
    # Correct base directory (this file ke location se)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH = os.path.join(BASE_DIR, "message_model.pkl")

    with open(MODEL_PATH, "rb") as f:
        model, vectorizer = pickle.load(f)

    return model, vectorizer
