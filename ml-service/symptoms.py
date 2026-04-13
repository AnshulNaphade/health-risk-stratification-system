# Must stay in sync with src/engine/symptomNormalizer.js

SYMPTOMS = [
    "chest pain",
    "shortness of breath",
    "high fever",
    "severe headache",
    "dizziness",
    "persistent cough",
    "fatigue",
    "nausea",
    "sore throat",
    "runny nose",
    "mild headache",
    "body ache",
    "loss of appetite",
    "vomiting",
    "abdominal pain",
]

SYMPTOM_INDEX = {symptom: idx for idx, symptom in enumerate(SYMPTOMS)}

RISK_LEVELS = ["LOW", "MODERATE", "HIGH", "CRITICAL"]