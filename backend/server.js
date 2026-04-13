import app from './src/app.js'
import { env } from './src/config/env.js'
import { prisma } from './src/config/prisma.js'

const startServer = async () => {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')

    app.listen(env.port, () => {
      console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`)
      console.log(`Health check: http://localhost:${env.port}/health`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()