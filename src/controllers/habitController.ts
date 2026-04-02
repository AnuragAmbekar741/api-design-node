import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/authorisation.ts'
import { db } from '../db/connection.ts'
import { habits, habitTags } from '../db/schema.ts'
import { desc, eq } from 'drizzle-orm'

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

export const getUserHabits = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id
    const userHabitsWithTags = await db.query.habits.findMany({
      where: eq(habits.userId, userId),
      with: {
        habitTags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: [desc(habits.createAt)],
    })
    const habitWithTag = userHabitsWithTags.map((habit) => ({
      ...habit,
      tags: habit.habitTags.map((ht) => ht.tag),
      habitTags: undefined,
    }))
    res.status(200).json({
      message: '',
      habits: habitWithTag,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch habits' })
  }
}
