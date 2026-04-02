import { Router } from 'express'
import { z } from 'zod'
import {
  payloadValidation,
  paramValidation,
} from '../middlewares/validation.ts'
import { apiGuard } from '../middlewares/authorisation.ts'
import { createHabit, getUserHabits } from '../controllers/habitController.ts'
import { habitSchema } from '../db/schema.ts'

const router = Router()

router.use(apiGuard)

const habitParamsSchema = z.object({
  id: z.string().max(2),
})

router.get('/', getUserHabits)

router.get('/:id', paramValidation(habitParamsSchema), (req, res) => {
  const habit = req.params.id
  res.json({ message: `your ${habit}` })
})

router.post('/', payloadValidation(habitSchema), createHabit)

router.delete('/:id', (req, res) => {
  res.json({ message: 'habit deleted' })
})

export default router
