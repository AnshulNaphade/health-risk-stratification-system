// Maps raw symptom strings to normalized weighted entries
// Weight represents clinical significance for risk scoring (0.1 - 1.0)

const SYMPTOM_WEIGHTS = {
  'chest pain':        { weight: 1.0, category: 'cardiovascular' },
  'shortness of breath': { weight: 0.9, category: 'respiratory' },
  'high fever':        { weight: 0.8, category: 'infection' },
  'severe headache':   { weight: 0.7, category: 'neurological' },
  'dizziness':         { weight: 0.6, category: 'neurological' },
  'persistent cough':  { weight: 0.6, category: 'respiratory' },
  'fatigue':           { weight: 0.4, category: 'general' },
  'nausea':            { weight: 0.4, category: 'gastrointestinal' },
  'sore throat':       { weight: 0.3, category: 'infection' },
  'runny nose':        { weight: 0.2, category: 'infection' },
  'mild headache':     { weight: 0.2, category: 'neurological' },
  'body ache':         { weight: 0.3, category: 'general' },
  'loss of appetite':  { weight: 0.3, category: 'general' },
  'vomiting':          { weight: 0.5, category: 'gastrointestinal' },
  'abdominal pain':    { weight: 0.6, category: 'gastrointestinal' },
}

export const normalizeSymptoms = (rawSymptoms) => {
  const normalized = []

  for (const symptom of rawSymptoms) {
    const key = symptom.toLowerCase().trim()
    const match = SYMPTOM_WEIGHTS[key]

    if (match) {
      normalized.push({ symptom: key, ...match })
    } else {
      // Unknown symptom gets a default low weight
      normalized.push({ symptom: key, weight: 0.2, category: 'unknown' })
    }
  }

  return normalized
}

export const getSupportedSymptoms = () => Object.keys(SYMPTOM_WEIGHTS)