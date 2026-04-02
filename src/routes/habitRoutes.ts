import { Router } from 'express'
import { z } from 'zod'
import {
  payloadValidation,
  paramValidation,
} from '../middlewares/validation.ts'
import { apiGuard } from '../middlewares/authorisation.ts'

const router = Router()

router.use(apiGuard)

const habitSchema = z.object({
  name: z.string(),
})

const habitParamsSchema = z.object({
  id: z.string().max(2),
})

router.get('/', (req, res) => {
  res.json({ message: 'all your habits' })
})

router.get('/:id', paramValidation(habitParamsSchema), (req, res) => {
  const habit = req.params.id
  res.json({ message: `your ${habit}` })
})

router.post('/', payloadValidation(habitSchema), (req, res) => {
  res.json({ message: 'new habit added' }).status(201)
})

router.delete('/:id', (req, res) => {
  res.json({ message: 'habit deleted' })
})

export default router
