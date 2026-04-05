import { prisma } from '../config/prisma.js'

export const createUser = async ({ email, passwordHash, name }) => {
  return prisma.user.create({
    data: { email, passwordHash, name },
  })
}

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  })
}

export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  })
}