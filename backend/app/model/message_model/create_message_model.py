import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
import os

def train_message_model():
    print("Loading dataset...")

    # Load CSV (correct columns: Msg, Label)
    df = pd.read_csv("spam_ham_india.csv")  

    # Rename for uniformity
    df = df.rename(columns={"Msg": "text", "Label": "label"})

    # Convert spam/ham to 1/0
    df['label'] = df['label'].map({'ham': 0, 'spam': 1})

    X = df['text']
    y = df['label']

    vectorizer = TfidfVectorizer(stop_words='english')
    X_vec = vectorizer.fit_transform(X)

    model = LogisticRegression(max_iter=2000)
    model.fit(X_vec, y)

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    with open(os.path.join(BASE_DIR, "message_model.pkl"), "wb") as f:
        pickle.dump((model, vectorizer), f)

    print("Message model trained and saved in message_model.pkl")

if __name__ == "__main__":
    train_message_model()
