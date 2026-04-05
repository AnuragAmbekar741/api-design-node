import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/authorisation.ts'
import { db } from '../db/connection.ts'
import { habits, habitTags, entries } from '../db/schema.ts'
import { desc, eq, and } from 'drizzle-orm'

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

export const getUserHabit = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const userhabit = await db.query.habits.findFirst({
      where: and(eq(habits.id, id), eq(habits.userId, userId)),
      with: {
        habitTags: {
          with: {
            tag: true,
          },
        },
        entries: {
          orderBy: [desc(entries.completionDate)],
          limit: 10,
        },
      },
    })
    if (!userhabit) {
      return res.status(404).json({
        error: 'Invalid habit id',
      })
    }
    const habitWithTags = {
      ...userhabit,
      tags: userhabit.habitTags.map((ht) => ht.tag),
      habitTags: undefined,
    }
    res.status(201).json({
      habit: habitWithTags,
    })
  } catch (err) {
    console.error('Something went wrong!')
  }
}

export const updateHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const { tagIds, ...updates } = req.body
    const result = await db.transaction(async (tx) => {
      const [updatedHabit] = await tx
        .update(habits)
        .set({
          ...updates,
          updatedAt: Date.now(),
        })
        .where(and(eq(habits.id, id), eq(habits.userId, userId)))
        .returning()

      if (!updatedHabit) {
        return res.status(400).end()
      }

      if (tagIds !== undefined) {
        tx.delete(habits).where(eq(habitTags.habitId, id))
      }
      if (tagIds.length > 0) {
        const habitValues = tagIds.map((tagId: string) => ({
          habitId: id,
          tagId,
        }))
        await tx.insert(habitTags).values(habitValues)
      }
      return updatedHabit
    })
    res.json({
      message: 'Habit updated successfully',
      habit: result,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const deleteHabit = async () => {}
