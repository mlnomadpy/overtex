import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // CORS
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map(origin => origin.trim()),
  
  // LaTeX
  texWorkspaceRoot: process.env.TEX_WORKSPACE_ROOT || '/workspaces/overtex',
  buildTimeout: parseInt(process.env.BUILD_TIMEOUT || '60000', 10),
  
  // Security
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Derived
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
}
