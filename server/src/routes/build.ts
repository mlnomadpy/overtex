import { Router, Request, Response, NextFunction } from 'express'
import { latexService } from '../services/latexService.js'
import { validateBuildRequest } from '../middleware/validation.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'
import { logger } from '../utils/logger.js'

const router = Router()

interface BuildRequestBody {
  sourceFile: string
  outputDir: string
  command?: string
}

// POST /api/build - Trigger LaTeX build
router.post('/build', validateBuildRequest, asyncHandler(async (req: Request<{}, {}, BuildRequestBody>, res: Response) => {
  const { sourceFile, outputDir, command } = req.body

  logger.info('Build requested', { sourceFile, outputDir, command })

  const result = await latexService.build(sourceFile, outputDir, command)

  const statusCode = result.success ? 200 : 500

  if (result.success) {
    logger.info('Build completed successfully', { sourceFile, outputDir })
  } else {
    logger.error('Build failed', { sourceFile, outputDir, message: result.message })
  }

  return res.status(statusCode).json(result)
}))

// GET /api/build/status - Check build status (for future use)
router.get('/build/status', (req: Request, res: Response) => {
  res.json({
    isBuilding: false,
    success: null,
    error: null,
  })
})

export { router as buildRouter }
