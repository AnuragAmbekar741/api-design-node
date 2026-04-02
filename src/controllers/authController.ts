import type { Request, Response } from 'express'
import { db } from '../db/connection.ts'
import { users } from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { hashedPassword } from '../utils/hashPassword.ts'

export const register = (req: Request, res: Response) => {
  try {
  } catch (err) {}
}
