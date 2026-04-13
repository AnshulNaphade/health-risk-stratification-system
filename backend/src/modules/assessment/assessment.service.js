import { normalizeSymptoms } from '../../engine/symptomNormalizer.js'
import { computeRiskScore } from '../../engine/riskScorer.js'
import { computeConfidence } from '../../engine/confidenceModel.js'
import { generateExplanation } from '../../engine/explainability.js'
import { generateGuidance } from '../../engine/guidanceEngine.js'
import { createAssessment } from '../../repository/assessment.repository.js'
import { env } from '../../config/env.js'

// Maps ML predicted risk level to a numeric score for blending
const LEVEL_TO_SCORE = {
  LOW:      0.15,
  MODERATE: 0.48,
  HIGH:     0.70,
  CRITICAL: 0.90,
}

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
    console.warn('[ML Service] Unavailable, skipping ML score')
    return null
  }
}

export const runAssessment = async (userId, rawSymptoms) => {
  // Step 1 — Rule-based engine
  const normalized = normalizeSymptoms(rawSymptoms)
  const { riskScore: ruleScore, riskLevel: ruleLevel } = computeRiskScore(normalized)
  const confidenceScore = computeConfidence(rawSymptoms, normalized)

  // Step 2 — Call ML service
  const mlResult = await callMLService(rawSymptoms)

  // Step 3 — Extract ML predicted level and convert to numeric score
  // mlResult.riskLevel is the predicted class e.g. "LOW"
  // mlResult.mlScore is the confidence of that prediction e.g. 0.90
  // We use the predicted level mapped to a score, NOT the raw probability
  const mlPredictedLevel = mlResult?.riskLevel ?? null
  const mlNumericScore   = mlPredictedLevel ? LEVEL_TO_SCORE[mlPredictedLevel] : null

  // Step 4 — Blend: 60% rule-based + 40% ML numeric score
  const blendedScore = mlNumericScore !== null
    ? parseFloat((ruleScore * 0.6 + mlNumericScore * 0.4).toFixed(3))
    : ruleScore

  // Step 5 — Final risk level from blended score
  const finalLevel = blendedScore >= 0.80 ? 'CRITICAL'
    : blendedScore >= 0.60 ? 'HIGH'
    : blendedScore >= 0.35 ? 'MODERATE'
    : 'LOW'

  // Step 6 — Generate explanation and guidance
  const explanation = generateExplanation(normalized, ruleScore, finalLevel)
  const guidance    = generateGuidance(normalized, finalLevel)

  // Step 7 — Persist
  const assessment = await createAssessment({
    userId,
    symptoms:        rawSymptoms,
    riskLevel:       finalLevel,
    riskScore:       blendedScore,
    confidenceScore,
    explanation,
    guidance,
    mlScore:         mlNumericScore,
  })

  return {
    ...assessment,
    breakdown: {
      ruleBasedScore:  ruleScore,
      mlPredicted:     mlPredictedLevel ?? 'unavailable',
      mlScore:         mlNumericScore   ?? 'unavailable',
      blendedScore,
      mlProbabilities: mlResult?.probabilities ?? null,
    },
  }
}