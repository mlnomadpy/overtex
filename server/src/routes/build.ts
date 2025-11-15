import { Router, Request, Response } from 'express'
import { latexService } from '../services/latexService.js'

const router = Router()

interface BuildRequestBody {
  sourceFile: string
  outputDir: string
  command?: string
}

// POST /api/build - Trigger LaTeX build
router.post('/build', async (req: Request<{}, {}, BuildRequestBody>, res: Response) => {
  try {
    const { sourceFile, outputDir, command } = req.body

    if (!sourceFile || !outputDir) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: sourceFile, outputDir',
        logs: [],
      })
    }

    console.log(`🔨 Building: ${sourceFile} in ${outputDir}`)

    const result = await latexService.build(sourceFile, outputDir, command)

    const statusCode = result.success ? 200 : 500

    return res.status(statusCode).json(result)
  } catch (error: any) {
    console.error('Build error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      logs: [error.message],
    })
  }
})

// GET /api/build/status - Check build status (for future use)
router.get('/build/status', (req: Request, res: Response) => {
  res.json({
    isBuilding: false,
    success: null,
    error: null,
  })
})

export { router as buildRouter }
