from fastapi import APIRouter

router = APIRouter(prefix="/recognition", tags=["Sign Recognition Pipeline"])

@router.get("/info")
def get_recognition_info():
    return {
        "status": "Coming in next integration phase",
        "pipeline": [
            "1. Client Camera Stream",
            "2. MediaPipe Hand Detection & 21 Hand Landmarks",
            "3. Feature Extraction & Normalization",
            "4. Scikit-learn Classifier Model Inference",
            "5. Real-time Sign Label Output"
        ],
        "supported_alphabets": 26,
        "supported_words": ["HELLO", "YES", "NO", "THANK YOU", "PLEASE", "GOODBYE", "LOVE", "HELP"],
        "is_active": False,
        "message": "Camera recognition system shell established. Real-time inference model will be connected after MediaPipe model training."
    }

@router.post("/predict")
def predict_sign_placeholder():
    return {
        "status": "Coming in next integration phase",
        "label": None,
        "confidence": None,
        "message": "Camera recognition will be connected after MediaPipe and ML model integration phase."
    }
