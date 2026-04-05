import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { requestLogger } from './middleware/requestLogger.js'
import { errorHandler } from './middleware/error.middleware.js'
import authRoutes       from './modules/auth/auth.routes.js'
import assessmentRoutes from './modules/assessment/assessment.routes.js'
import historyRoutes    from './modules/history/history.routes.js'

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
})
app.use('/api', limiter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() })
})

// Routes
app.use('/api/v1/auth',        authRoutes)
app.use('/api/v1/assessments', assessmentRoutes)
app.use('/api/v1/history',     historyRoutes)

// Global error handler — must be last
app.use(errorHandler)

export default app