Perfect! Here’s the **updated README** reflecting that **both SMS and URL models are created via `create_*_model` functions automatically**, with no manual training commands needed:

---

# Scam Detector

A machine learning-based project to detect scams from **SMS** and **URLs**. The project automatically trains models if pre-trained `.pkl` files are missing.

---

## 📂 Folder Structure

```
backend/
│
├── app/
│   ├── main.py                  # FastAPI entrypoint
│   ├── model/
│   │   ├── message_model/
│   │   │   └── create_message_model.py
│   │   └── url_model/
│   │       └── create_url_model.py
│   └── utils/
│       ├── preprocess_text.py
│       └── preprocess_url.py
│
├── requirements.txt
└── README.md
```

---

## ⚙️ Requirements & Installation

Make sure **Python 3.10+** is installed.

Install dependencies:

```bash
pip install -r requirements.txt
```

Example `requirements.txt`:

```
fastapi
uvicorn
scikit-learn
pandas
numpy
joblib
```

(Add any additional libraries your project uses.)

---

## 🚀 Running the App

Simply start the FastAPI server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

* On startup, the server will **check for `.pkl` files**.
* If missing, it will automatically **train both SMS and URL models** using:

```bash
python app/model/message_model/create_message_model.py
python app/model/url_model/create_url_model.py
```

* Trained models are saved as `.pkl` for future runs.

---

## 📝 API Testing

Open Swagger UI:

```
http://127.0.0.1:8000/docs
```

* Test **SMS scam detection**
* Test **URL scam detection**





