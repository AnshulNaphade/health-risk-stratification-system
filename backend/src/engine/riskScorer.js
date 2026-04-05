// Computes a risk score (0.0 - 1.0) and risk level from normalized symptoms

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

  // Weighted average — higher weight symptoms pull score up more
  const totalWeight = normalizedSymptoms.reduce((sum, s) => sum + s.weight, 0)
  const maxPossibleWeight = normalizedSymptoms.length * 1.0
  const rawScore = totalWeight / maxPossibleWeight

  // Symptom count multiplier — more symptoms = higher concern
  const countMultiplier = Math.min(1 + (normalizedSymptoms.length - 1) * 0.05, 1.3)
  const finalScore = Math.min(rawScore * countMultiplier, 1.0)

  const riskLevel = Object.entries(RISK_THRESHOLDS).find(
    ([, range]) => finalScore >= range.min && finalScore <= range.max
  )?.[0] ?? 'MODERATE'

  return {
    riskScore: parseFloat(finalScore.toFixed(3)),
    riskLevel,
  }
}