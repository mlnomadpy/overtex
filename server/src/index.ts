import express from 'express'
import cors from 'cors'
import { buildRouter } from './routes/build.js'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}))
app.use(express.json())

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`🚀 OverTeX API Server running on http://localhost:${PORT}`)
    console.log(`📄 PDF endpoint: http://localhost:${PORT}/api/pdf`)
    console.log(`🔨 Build endpoint: http://localhost:${PORT}/api/build`)
  })
}

export { app }
