// Generates human-readable explanation of why a risk level was assigned

export const generateExplanation = (normalizedSymptoms, riskScore, riskLevel) => {
  if (!normalizedSymptoms.length) {
    return 'No symptoms were provided for analysis.'
  }

  const highWeightSymptoms = normalizedSymptoms
    .filter(s => s.weight >= 0.7)
    .map(s => s.symptom)

  const moderateWeightSymptoms = normalizedSymptoms
    .filter(s => s.weight >= 0.4 && s.weight < 0.7)
    .map(s => s.symptom)

  const parts = []

  parts.push(`Based on ${normalizedSymptoms.length} reported symptom(s), a risk score of ${(riskScore * 100).toFixed(1)}% was calculated.`)

  if (highWeightSymptoms.length) {
    parts.push(`High-concern symptoms detected: ${highWeightSymptoms.join(', ')}.`)
  }

  if (moderateWeightSymptoms.length) {
    parts.push(`Moderate-concern symptoms detected: ${moderateWeightSymptoms.join(', ')}.`)
  }

  const levelMessages = {
    LOW:      'Your symptom profile suggests a low risk level. Monitor your symptoms and rest.',
    MODERATE: 'Your symptom profile suggests a moderate risk level. Consider consulting a healthcare professional if symptoms persist.',
    HIGH:     'Your symptom profile suggests a high risk level. It is advisable to seek medical attention soon.',
    CRITICAL: 'Your symptom profile suggests a critical risk level. Please seek immediate medical attention.',
  }

  parts.push(levelMessages[riskLevel])
  parts.push('Note: This is an awareness tool only and does not constitute medical advice.')

  return parts.join(' ')
}