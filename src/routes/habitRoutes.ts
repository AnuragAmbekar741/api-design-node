import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'all your habits' })
})

router.get('/:id', (req, res) => {
  const habit = req.params.id
  res.json({ message: `your ${habit}` })
})

router.post('/', (req, res) => {
  res.json({ message: 'new habit added' }).status(201)
})

router.delete('/:id', (req, res) => {
  res.json({ message: 'habit deleted' })
})

export default router
