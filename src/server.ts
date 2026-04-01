import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import { isTest } from '../env.ts'

const app = express()

//global middlewares

//security headers
app.use(helmet())

//CORS
app.use(
  cors({
    origin: ['http://localhost:5173/'],
  })
)

//Parse body
app.use(express.json())
//Parse URL
app.use(express.urlencoded({ extended: true }))

//Logging
app.use(
  morgan('dev', {
    skip: () => isTest(),
  })
)

app.get('/health', (req, res) => {
  res.json({
    message: 'Server health 100%',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/habits', habitRoutes)

export { app }
