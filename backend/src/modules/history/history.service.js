import {
  findAssessmentsByUserId,
  findAssessmentById,
} from '../../repository/assessment.repository.js'
import { ApiError } from '../../utils/ApiError.js'

export const getUserHistory = async (userId) => {
  return findAssessmentsByUserId(userId)
}

export const getAssessmentDetail = async (id, userId) => {
  const assessment = await findAssessmentById(id, userId)
  if (!assessment) throw ApiError.notFound('Assessment not found')
  return assessment
}