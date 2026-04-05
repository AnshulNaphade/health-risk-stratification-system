import { getUserHistory, getAssessmentDetail } from './history.service.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

export const getHistory = async (req, res, next) => {
  try {
    const data = await getUserHistory(req.user.id)
    return ApiResponse.success(res, data, 'History fetched')
  } catch (err) {
    next(err)
  }
}

export const getDetail = async (req, res, next) => {
  try {
    const data = await getAssessmentDetail(req.params.id, req.user.id)
    return ApiResponse.success(res, data, 'Assessment fetched')
  } catch (err) {
    next(err)
  }
}