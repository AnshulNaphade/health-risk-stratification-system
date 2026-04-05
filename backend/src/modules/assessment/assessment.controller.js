import { runAssessment } from './assessment.service.js'
import { getSupportedSymptoms } from '../../engine/symptomNormalizer.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

export const createAssessment = async (req, res, next) => {
  try {
    const result = await runAssessment(req.user.id, req.body.symptoms)
    return ApiResponse.created(res, result, 'Assessment completed')
  } catch (err) {
    next(err)
  }
}

export const listSymptoms = async (req, res) => {
  return ApiResponse.success(res, getSupportedSymptoms(), 'Supported symptoms fetched')
}