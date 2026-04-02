import { Router } from 'express'
import { register, signIn } from '../controllers/authController.ts'
import { payloadValidation } from '../middlewares/validation.ts'
import { insertUserScehma } from '../db/schema.ts'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be 8 char long'),
})

const router = Router()

router.post('/register', payloadValidation(insertUserScehma), register)

router.post('/login', payloadValidation(loginSchema), signIn)

router.post('/refresh', () => {})

export default router
