const RISK_THRESHOLDS = {
  LOW:      { min: 0.0,  max: 0.35 },
  MODERATE: { min: 0.35, max: 0.60 },
  HIGH:     { min: 0.60, max: 0.80 },
  CRITICAL: { min: 0.80, max: 1.0  },
}

export const computeRiskScore = (normalizedSymptoms) => {
  if (!normalizedSymptoms.length) {
    return { riskScore: 0, riskLevel: 'LOW' }
  }

  const totalWeight    = normalizedSymptoms.reduce((sum, s) => sum + s.weight, 0)
  const averageWeight  = totalWeight / normalizedSymptoms.length

  // Only apply a small multiplier for large numbers of symptoms (5+)
  // Single mild symptoms should never be pushed above LOW
  const countBonus     = normalizedSymptoms.length > 4
    ? (normalizedSymptoms.length - 4) * 0.02
    : 0

  const finalScore = Math.min(averageWeight + countBonus, 1.0)

  const riskLevel = finalScore >= 0.80 ? 'CRITICAL'
    : finalScore >= 0.60 ? 'HIGH'
    : finalScore >= 0.35 ? 'MODERATE'
    : 'LOW'

  return {
    riskScore: parseFloat(finalScore.toFixed(3)),
    riskLevel,
  }
}