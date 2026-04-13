import { Router } from 'express'
import { createAssessment, listSymptoms } from './assessment.controller.js'
import { protect } from '../../middleware/auth.middleware.js'
import { validate } from '../../middleware/validate.middleware.js'
import { assessmentSchema } from './assessment.schema.js'

const router = Router()

router.get('/symptoms',  protect, listSymptoms)
router.post('/',         protect, validate(assessmentSchema), createAssessment)

export default router