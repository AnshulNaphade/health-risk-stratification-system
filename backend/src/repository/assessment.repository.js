import { prisma } from '../config/prisma.js'

export const createAssessment = async (data) => {
  return prisma.assessment.create({ data })
}

export const findAssessmentsByUserId = async (userId) => {
  return prisma.assessment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export const findAssessmentById = async (id, userId) => {
  return prisma.assessment.findFirst({
    where: { id, userId },
  })
}