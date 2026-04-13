import pickle
import numpy as np
from symptoms import SYMPTOMS, SYMPTOM_INDEX, RISK_LEVELS

_model = None

def load_model():
    global _model
    if _model is None:
        with open("model_artifacts/risk_model.pkl", "rb") as f:
            _model = pickle.load(f)
    return _model

def predict(symptoms: list[str]) -> dict:
    model = load_model()

    # Encode symptoms as binary vector
    vector = np.zeros(len(SYMPTOMS), dtype=int)
    unrecognized = []

    for symptom in symptoms:
        key = symptom.lower().strip()
        if key in SYMPTOM_INDEX:
            vector[SYMPTOM_INDEX[key]] = 1
        else:
            unrecognized.append(key)

    # Get class probabilities — this is the confidence-aware part
    proba = model.predict_proba(vector.reshape(1, -1))[0]
    predicted_class = int(np.argmax(proba))

    return {
        "riskLevel":       RISK_LEVELS[predicted_class],
        "mlScore":         float(proba[predicted_class]),
        "probabilities": {
            RISK_LEVELS[i]: round(float(p), 4)
            for i, p in enumerate(proba)
        },
        "unrecognizedSymptoms": unrecognized,
    }