import type { Response, Request, NextFunction } from 'express'
import { type ZodSchema, ZodError } from 'zod'

export const payloadValidation = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedPayload = schema.parse(req.body)
      req.body = validatedPayload
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues.map((e) => ({
            field: e.path.join(','),
            message: e.message,
          })),
        })
      }
      next(err)
    }
  }
}
