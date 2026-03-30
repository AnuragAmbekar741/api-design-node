import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'all users' })
})

router.get('/:id', (req, res) => {
  res.json({ message: 'user as per id' })
})

router.put('/:id', (req, res) => {
  res.json({ message: 'user updated' })
})

router.delete('/:id', (req, res) => {
  res.json({ message: 'user deleted' })
})

export default router
