import { z } from 'zod'

export const assessmentSchema = z.object({
  body: z.object({
    symptoms: z
      .array(z.string().min(1))
      .min(1, 'At least one symptom is required')
      .max(20, 'Maximum 20 symptoms allowed'),
  }),
})