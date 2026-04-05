// Returns non-medical wellness guidance based on risk level and symptom categories

const CATEGORY_GUIDANCE = {
  cardiovascular: 'Avoid physical exertion and rest in a comfortable position.',
  respiratory:    'Stay in a well-ventilated area and avoid smoke or strong odours.',
  neurological:   'Rest in a quiet, dark room and avoid screens if possible.',
  infection:      'Stay hydrated, rest well, and avoid close contact with others.',
  gastrointestinal: 'Avoid heavy meals. Stick to light food and stay hydrated.',
  general:        'Get adequate rest and maintain fluid intake.',
  unknown:        'Monitor your symptoms closely.',
}

const LEVEL_GUIDANCE = {
  LOW:      'Continue monitoring your symptoms. If they worsen or persist beyond 3 days, consider reaching out to a healthcare professional.',
  MODERATE: 'Keep track of your symptoms. If they intensify or new symptoms appear, consult a healthcare professional promptly.',
  HIGH:     'Do not ignore these symptoms. Seek medical attention at the earliest opportunity.',
  CRITICAL: 'This is urgent. Please contact emergency services or go to the nearest hospital immediately.',
}

export const generateGuidance = (normalizedSymptoms, riskLevel) => {
  const categories = [...new Set(normalizedSymptoms.map(s => s.category))]

  const categoryTips = categories
    .map(cat => CATEGORY_GUIDANCE[cat])
    .filter(Boolean)

  const guidance = [
    LEVEL_GUIDANCE[riskLevel],
    ...categoryTips,
    'Remember: This system provides awareness information only. Always consult a qualified healthcare professional for medical advice.',
  ]

  return guidance.join(' ')
}