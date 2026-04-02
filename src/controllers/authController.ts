import type { Request, Response } from 'express'
import { db } from '../db/connection.ts'
import { users, type CreateUser } from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { hashPassword, comparePassword } from '../utils/password.ts'
import { eq } from 'drizzle-orm'

export const register = async (
  req: Request<any, any, CreateUser>,
  res: Response
) => {
  try {
    const { email, username, password, firstName, lastName } = req.body
    const encryptedPassword = await hashPassword(password)
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
    res.status(500).json({ error: 'Failed to signup' })
  }
}

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Email or password doesnot match' })
    }
    const verifyPassword = await comparePassword(password, user.password)
    if (!verifyPassword) {
      return res
        .status(401)
        .json({ message: 'Email or password doesnot match' })
    }
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })
    res.status(201).json({
      message: 'Signin successfull',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createAt: user.createAt,
      },
      token: token,
    })
  } catch (err) {
    console.error('Signin error')
    res.status(500).json({ error: 'Failed to signin' })
  }
}

export const refreshToken = () => {}
