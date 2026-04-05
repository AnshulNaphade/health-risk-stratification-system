import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from symptoms import SYMPTOMS, RISK_LEVELS

# ------------------------------------------------------------
# Generate synthetic training data
# We encode each symptom as a binary feature (0 = absent, 1 = present)
# Risk level is determined by clinical weight rules matching our Node engine
# ------------------------------------------------------------

SYMPTOM_WEIGHTS = {
    "chest pain":           1.0,
    "shortness of breath":  0.9,
    "high fever":           0.8,
    "severe headache":      0.7,
    "dizziness":            0.6,
    "persistent cough":     0.6,
    "fatigue":              0.4,
    "nausea":               0.4,
    "sore throat":          0.3,
    "runny nose":           0.2,
    "mild headache":        0.2,
    "body ache":            0.3,
    "loss of appetite":     0.3,
    "vomiting":             0.5,
    "abdominal pain":       0.6,
}

def get_risk_label(symptom_vector):
    weights = [
        SYMPTOM_WEIGHTS[SYMPTOMS[i]] * symptom_vector[i]
        for i in range(len(SYMPTOMS))
    ]
    active = [w for w in weights if w > 0]
    if not active:
        return 0  # LOW

    avg = sum(active) / len(active)
    multiplier = min(1 + (len(active) - 1) * 0.05, 1.3)
    score = min(avg * multiplier, 1.0)

    if score < 0.35:  return 0  # LOW
    if score < 0.60:  return 1  # MODERATE
    if score < 0.80:  return 2  # HIGH
    return 3                    # CRITICAL

def generate_dataset(n_samples=3000):
    X, y = [], []
    rng = np.random.default_rng(42)

    for _ in range(n_samples):
        # Random number of symptoms (1-8)
        n_active = rng.integers(1, 9)
        vector = np.zeros(len(SYMPTOMS), dtype=int)
        indices = rng.choice(len(SYMPTOMS), size=n_active, replace=False)
        vector[indices] = 1
        X.append(vector)
        y.append(get_risk_label(vector))

    return np.array(X), np.array(y)

if __name__ == "__main__":
    print("Generating training data...")
    X, y = generate_dataset(3000)

    print(f"Dataset: {X.shape[0]} samples, {X.shape[1]} features")
    print(f"Class distribution: {dict(zip(RISK_LEVELS, np.bincount(y)))}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Training Random Forest...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    print("\nModel Performance:")
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred, target_names=RISK_LEVELS))

    # Save model
    os.makedirs("model_artifacts", exist_ok=True)
    with open("model_artifacts/risk_model.pkl", "wb") as f:
        pickle.dump(model, f)

    print("Model saved to model_artifacts/risk_model.pkl")