import type { Request, Response } from 'express'
import { db } from '../db/connection.ts'
import { users, type CreateUser } from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { hashedPassword } from '../utils/hashPassword.ts'

export const register = async (
  req: Request<any, any, CreateUser>,
  res: Response
) => {
  try {
    const { email, username, password, firstName, lastName } = req.body
    const encryptedPassword = await hashedPassword(password)
    const [user] = await db
      .insert(users)
      .values({
        email,
        password: encryptedPassword,
        username,
        firstName,
        lastName,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createAt: users.createAt,
      })

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    return res.status(201).json({ message: 'User created', user, token: token })
  } catch (err) {
    console.error('Registration error')
  }
}
