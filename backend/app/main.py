from fastapi import FastAPI
from pydantic import BaseModel
from app.model.message_model.load_message_model import load_message_model
from app.model.url_model.load_url_model import load_url_model
from app.utils.preprocess_url import prepare_url_for_model
from app.utils.preprocess_text import clean_text

app = FastAPI()

# Load SMS model
message_model, message_vectorizer = load_message_model()

# Load URL model
url_model = load_url_model()

class MessageInput(BaseModel):
    text: str

class URLInput(BaseModel):
    url: str


@app.post("/predict/message")
def predict_message(data: MessageInput):
    clean = clean_text(data.text)
    vec = message_vectorizer.transform([clean])
    pred = message_model.predict(vec)[0]
    return {"prediction": "scam" if pred == 1 else "legit"}


@app.post("/predict/url")
def predict_url(data: URLInput):
    df = prepare_url_for_model(data.url)

    pred = int(url_model.predict(df)[0])

    # Map number → category
    label_map = {
        0: "benign",
        1: "phishing",
        2: "malware",
        3: "defacement"
    }

    return {"prediction": label_map.get(pred, "unknown")}
