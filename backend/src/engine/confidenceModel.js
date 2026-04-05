// Computes a confidence score (0.0 - 1.0) based on how many symptoms
// were recognized and how specific they are

export const computeConfidence = (rawSymptoms, normalizedSymptoms) => {
  const totalSubmitted = rawSymptoms.length
  const recognized = normalizedSymptoms.filter(s => s.category !== 'unknown').length

  if (totalSubmitted === 0) return 0

  // Base confidence = ratio of recognized symptoms
  const recognitionRatio = recognized / totalSubmitted

  // Specificity bonus — high-weight symptoms increase confidence
  const avgWeight = normalizedSymptoms.reduce((sum, s) => sum + s.weight, 0) / normalizedSymptoms.length
  const specificityBonus = avgWeight * 0.2

  const confidence = Math.min(recognitionRatio * 0.8 + specificityBonus, 1.0)

  return parseFloat(confidence.toFixed(3))
}