import { registerUser, loginUser } from './auth.service.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body)
    return ApiResponse.created(res, result, 'Registration successful')
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body)
    return ApiResponse.success(res, result, 'Login successful')
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res) => {
  return ApiResponse.success(res, req.user, 'User profile fetched')
}