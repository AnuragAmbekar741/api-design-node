import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/authorisation.ts'
import { db } from '../db/connection.ts'
import { habits, entries, habitTags, tags } from '../db/schema.ts'

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, frequency, targetCount, tagIds } = req.body
    const userId = req.user!.id

    const txResult = await db.transaction(async (tx) => {
      const [newHabit] = await tx
        .insert(habits)
        .values({
          userId,
          name,
          description,
          frequency,
          targetCount,
        })
        .returning()

      if (tagIds && tagIds.length > 0) {
        const habitTagValues = tagIds.map((tagId: string) => ({
          habitId: newHabit.id,
          tagId,
        }))
        await tx.insert(habitTags).values(habitTagValues)
      }
      return newHabit
    })
    res.status(201).json({
      message: 'Habit successfully added',
      habit: txResult,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create habit' })
  }
}
