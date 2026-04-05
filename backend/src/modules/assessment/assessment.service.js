import { normalizeSymptoms } from '../../engine/symptomNormalizer.js'
import { computeRiskScore } from '../../engine/riskScorer.js'
import { computeConfidence } from '../../engine/confidenceModel.js'
import { generateExplanation } from '../../engine/explainability.js'
import { generateGuidance } from '../../engine/guidanceEngine.js'
import { createAssessment } from '../../repository/assessment.repository.js'
import { env } from '../../config/env.js'

// Call the Python ML microservice
const callMLService = async (symptoms) => {
  try {
    const response = await fetch(`${env.mlServiceUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms }),
    })

    if (!response.ok) return null
    return await response.json()
  } catch {
    // ML service unavailable — degrade gracefully, don't crash
    console.warn('[ML Service] Unavailable, skipping ML score')
    return null
  }
}

// Blend rule-based score with ML score
const blendScores = (ruleScore, mlScore) => {
  if (mlScore === null) return ruleScore
  // 60% rule-based (explainable) + 40% ML (adaptive)
  return parseFloat((ruleScore * 0.6 + mlScore * 0.4).toFixed(3))
}

export const runAssessment = async (userId, rawSymptoms) => {
  // Step 1 — Run rule-based engine
  const normalized = normalizeSymptoms(rawSymptoms)
  const { riskScore: ruleScore, riskLevel: ruleLevel } = computeRiskScore(normalized)
  const confidenceScore = computeConfidence(rawSymptoms, normalized)

  // Step 2 — Call ML service in parallel (don't await yet)
  const mlPromise = callMLService(rawSymptoms)

  // Step 3 — Generate explanation and guidance (can happen while ML runs)
  const explanation = generateExplanation(normalized, ruleScore, ruleLevel)
  const guidance = generateGuidance(normalized, ruleLevel)

  // Step 4 — Wait for ML result
  const mlResult = await mlPromise
  const mlScore = mlResult?.mlScore ?? null
  const finalScore = blendScores(ruleScore, mlScore)

  // Step 5 — Final risk level from blended score
  const finalLevel = finalScore >= 0.80 ? 'CRITICAL'
    : finalScore >= 0.60 ? 'HIGH'
    : finalScore >= 0.35 ? 'MODERATE'
    : 'LOW'

  // Step 6 — Persist
  const assessment = await createAssessment({
    userId,
    symptoms:        rawSymptoms,
    riskLevel:       finalLevel,
    riskScore:       finalScore,
    confidenceScore,
    explanation,
    guidance,
    mlScore,
  })

  return {
    ...assessment,
    breakdown: {
      ruleBasedScore: ruleScore,
      mlScore:        mlScore ?? 'unavailable',
      blendedScore:   finalScore,
      mlProbabilities: mlResult?.probabilities ?? null,
    },
  }
}