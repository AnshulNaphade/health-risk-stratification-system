import { ApiError } from '../utils/ApiError.js'
import { env } from '../config/env.js'

export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}`, err)

  if (err instanceof ApiError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    })
  }

  return res.status(500).json({
    success: false,
    message: env.nodeEnv === 'development' ? err.message : 'Something went wrong',
  })
}