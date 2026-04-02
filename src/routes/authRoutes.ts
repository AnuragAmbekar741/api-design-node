import { Router } from 'express'
import { register } from '../controllers/authController.ts'
import { payloadValidation } from '../middlewares/validation.ts'
import { insertUserScehma } from '../db/schema.ts'

const router = Router()

router.post('/register', payloadValidation(insertUserScehma), register)

router.post('/login', (req, res) => {
  res.status(201).json({
    message: 'user logged in',
  })
})

export default router
