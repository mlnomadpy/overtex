import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from '../config/env.js'

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
})

// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Build-specific rate limiting (stricter)
export const buildRateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // 10 builds per minute
  message: 'Too many build requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})
