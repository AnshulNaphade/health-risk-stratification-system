import { normalizeSymptoms } from '../../engine/symptomNormalizer.js'
import { computeRiskScore } from '../../engine/riskScorer.js'
import { computeConfidence } from '../../engine/confidenceModel.js'
import { generateExplanation } from '../../engine/explainability.js'
import { generateGuidance } from '../../engine/guidanceEngine.js'
import { createAssessment } from '../../repository/assessment.repository.js'

export const runAssessment = async (userId, rawSymptoms) => {
  // Run through all 5 engine modules
  const normalized    = normalizeSymptoms(rawSymptoms)
  const { riskScore, riskLevel } = computeRiskScore(normalized)
  const confidenceScore = computeConfidence(rawSymptoms, normalized)
  const explanation   = generateExplanation(normalized, riskScore, riskLevel)
  const guidance      = generateGuidance(normalized, riskLevel)

  // Persist to DB
  const assessment = await createAssessment({
    userId,
    symptoms: rawSymptoms,
    riskLevel,
    riskScore,
    confidenceScore,
    explanation,
    guidance,
  })

  return assessment
}