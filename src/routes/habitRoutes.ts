import { Router } from 'express'
import { z } from 'zod'
import { payloadValidation } from '../middlewares/validation.ts'

const router = Router()

const habitSchema = z.object({
  name: z.string(),
})

router.get('/', (req, res) => {
  res.json({ message: 'all your habits' })
})

router.get('/:id', (req, res) => {
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
