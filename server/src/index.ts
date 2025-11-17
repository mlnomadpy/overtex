import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { buildRouter } from './routes/build.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { logger } from './utils/logger.js'
import path from 'path'

const app = express()
const PORT = parseInt(process.env.PORT || '3000', 10)
const NODE_ENV = process.env.NODE_ENV || 'development'
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173']

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disable for now, configure later
}))

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
})

const buildLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit builds to 10 per minute
  message: 'Too many build requests, please try again later',
})

app.use('/api/', limiter)
app.use('/api/build', buildLimiter)

// CORS Configuration
app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST'],
}))

// Body Parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })
  next()
})

// Health Check Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  })
})

app.get('/ready', async (req, res) => {
  // Check if LaTeX is available
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execPromise = promisify(exec)
    await execPromise('latexmk --version')
    res.status(200).json({
      status: 'ready',
      latex: 'available',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('LaTeX not available', error)
    res.status(503).json({
      status: 'not ready',
      latex: 'unavailable',
      timestamp: new Date().toISOString(),
    })
  }
})

// Routes
app.use('/api', buildRouter)

// Serve PDF files
app.get('/api/pdf', (req, res) => {
  const pdfPath = path.join(process.cwd(), '../tex/main.pdf')
  res.sendFile(pdfPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'PDF not found. Build the document first.' })
    }
  })
})

// 404 Handler
app.use(notFoundHandler)

// Error Handler (must be last)
app.use(errorHandler)

// Start server
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 OverTeX API Server started`, {
      port: PORT,
      environment: NODE_ENV,
      endpoints: {
        health: `http://localhost:${PORT}/health`,
        ready: `http://localhost:${PORT}/ready`,
        pdf: `http://localhost:${PORT}/api/pdf`,
        build: `http://localhost:${PORT}/api/build`,
      },
    })
  })

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully')
    process.exit(0)
  })

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully')
    process.exit(0)
  })
}

export { app }
