import { ApiError } from '../utils/ApiError.js'

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query })

  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    return next(ApiError.badRequest('Validation failed', errors))
  }

  next()
}