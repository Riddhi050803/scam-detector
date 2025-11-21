from flask import Flask, request, jsonify
from utils.ocr import extract_dob_name
from utils.face_matcher import FaceMatcher
from utils.age import is_adult
from utils.feedback import evaluate_image_quality
import cv2
import os
import uuid
from flask_cors import CORS

app = Flask(__name__)

# Allow all mobile requests
CORS(app)

UPLOAD_FOLDER = "temp_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

face_matcher = FaceMatcher()

def save_uploaded_images():
    doc_img = request.files.get("document")
    selfie_img = request.files.get("selfie")

    if not doc_img or not selfie_img:
        return None, None, jsonify({"error": "Please upload document & selfie"}), 400

    # Save document
    doc_ext = os.path.splitext(doc_img.filename)[1]
    doc_path = os.path.join(UPLOAD_FOLDER, f"doc_{uuid.uuid4().hex}{doc_ext}")
    doc_img.save(doc_path)

    # Save selfie
    selfie_ext = os.path.splitext(selfie_img.filename)[1]
    selfie_path = os.path.join(UPLOAD_FOLDER, f"selfie_{uuid.uuid4().hex}{selfie_ext}")
    selfie_img.save(selfie_path)

    return doc_path, selfie_path, None, None


# ============================
# ✔ Route 1: Image Quality Check
# ============================
@app.route("/check-quality", methods=["POST"])
def check_quality():
    doc_path, selfie_path, error_response, error_code = save_uploaded_images()

    if error_response:
        return error_response, error_code

    doc_image = cv2.imread(doc_path)
    selfie_image = cv2.imread(selfie_path)

    doc_feedback = evaluate_image_quality(doc_image)
    selfie_feedback = evaluate_image_quality(selfie_image)

    return jsonify({
        "document_feedback": doc_feedback,
        "selfie_feedback": selfie_feedback
    })


# ============================
# ✔ Route 2: Verify Face + Age
# ============================
@app.route("/verify", methods=["POST"])
def verify():
    doc_path, selfie_path, error_response, error_code = save_uploaded_images()

    if error_response:
        return error_response, error_code

    # OCR for name + DOB
    ocr_result = extract_dob_name(doc_path)
    dob = ocr_result.get("dob")
    name = ocr_result.get("name")

    # Face matching
    match_result = face_matcher.compare_faces(doc_path, selfie_path)

    if match_result.get("error"):
        return jsonify({
            "error": match_result["error"],
            "reason": "Face missing in input images"
        }), 400

    age = is_adult(dob) if dob else 0

    result = {
        "name": name,
        "dob": dob,
        "age": age,
        "is_adult": age >= 18,
        "face_match": match_result.get("match"),
        "confidence": match_result.get("confidence")
    }

    print("RESULT →", result)

    return jsonify(result)


# ============================
# Test Route
# ============================
@app.route("/")
def home():
    return "Flask Backend Connected to Mobile App!"


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
