import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AppError } from './errorHandler.js'

export const buildRequestSchema = z.object({
  sourceFile: z.string().min(1).max(255).regex(/^[a-zA-Z0-9_\-\.]+\.tex$/, 'Invalid file name'),
  outputDir: z.string().min(1).max(255).regex(/^[a-zA-Z0-9_\-\/]+$/, 'Invalid directory path'),
  command: z.enum(['latexmk', 'pdflatex', 'xelatex', 'lualatex']).optional(),
})

export const validateBuildRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    buildRequestSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e: any) => e.message).join(', ')
      throw new AppError(
        `Validation error: ${errorMessage}`,
        400
      )
    }
    next(error)
  }
}
