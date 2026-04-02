import bcrypt from 'bcrypt'
import env from '../../env.ts'

export const hashedPassword = async (password: string) => {
  return bcrypt.hash(password, env.BCRYPT_ROUNDS)
}
