import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createUser, findUserByEmail } from '../../repository/user.repository.js'
import { ApiError } from '../../utils/ApiError.js'
import { env } from '../../config/env.js'

export const registerUser = async ({ email, password, name }) => {
  const existing = await findUserByEmail(email)
  if (existing) throw ApiError.badRequest('Email already registered')

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await createUser({ email, passwordHash, name })

  const token = jwt.sign({ id: user.id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  }
}

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email)
  if (!user) throw ApiError.unauthorized('Invalid email or password')

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) throw ApiError.unauthorized('Invalid email or password')

  const token = jwt.sign({ id: user.id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  }
}