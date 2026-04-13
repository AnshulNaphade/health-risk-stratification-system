import { Router } from 'express'
import { getHistory, getDetail } from './history.controller.js'
import { protect } from '../../middleware/auth.middleware.js'

const router = Router()

router.get('/',     protect, getHistory)
router.get('/:id',  protect, getDetail)

export default router