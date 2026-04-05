const SYMPTOM_WEIGHTS = {
  'chest pain':           { weight: 1.0, category: 'cardiovascular' },
  'shortness of breath':  { weight: 0.9, category: 'respiratory' },
  'high fever':           { weight: 0.8, category: 'infection' },
  'severe headache':      { weight: 0.7, category: 'neurological' },
  'abdominal pain':       { weight: 0.6, category: 'gastrointestinal' },
  'dizziness':            { weight: 0.6, category: 'neurological' },
  'persistent cough':     { weight: 0.5, category: 'respiratory' },
  'vomiting':             { weight: 0.5, category: 'gastrointestinal' },
  'fatigue':              { weight: 0.3, category: 'general' },
  'nausea':               { weight: 0.3, category: 'gastrointestinal' },
  'body ache':            { weight: 0.25, category: 'general' },
  'loss of appetite':     { weight: 0.25, category: 'general' },
  'sore throat':          { weight: 0.2, category: 'infection' },
  'mild headache':        { weight: 0.15, category: 'neurological' },
  'runny nose':           { weight: 0.1,  category: 'infection' },
}

export const normalizeSymptoms = (rawSymptoms) => {
  const normalized = []

  for (const symptom of rawSymptoms) {
    const key   = symptom.toLowerCase().trim()
    const match = SYMPTOM_WEIGHTS[key]

    if (match) {
      normalized.push({ symptom: key, ...match })
    } else {
      normalized.push({ symptom: key, weight: 0.15, category: 'unknown' })
    }
  }

  return normalized
}

export const getSupportedSymptoms = () => Object.keys(SYMPTOM_WEIGHTS)