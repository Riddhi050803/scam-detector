import re
import pandas as pd

# -------- BASIC URL CLEANING --------
def clean_url(url: str) -> str:
    url = url.strip()
    url = url.lower()

    # Remove leading/trailing spaces
    url = url.replace(" ", "")

    return url


# -------- FEATURE EXTRACTION --------
def extract_features(url: str):
    url = clean_url(url)

    features = {
        "url_length": len(url),
        "num_dots": url.count('.'),
        "num_slash": url.count('/'),
        "num_hyphens": url.count('-'),
        "num_digits": sum(c.isdigit() for c in url),
        "has_https": 1 if url.startswith("https") else 0,
        "has_ip": 1 if re.match(r'\d+\.\d+\.\d+\.\d+', url) else 0,
    }

    suspicious_words = [
        "secure", "account", "login", "update", "free",
        "confirm", "bank", "verify", "apple", "paypal"
    ]

    features["suspicious_words"] = sum(
        word in url for word in suspicious_words
    )

    return features


# -------- Convert features → DataFrame for model --------
def prepare_url_for_model(url: str):
    features = extract_features(url)
    return pd.DataFrame([features])
