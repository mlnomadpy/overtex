import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildService } from '../buildService'
import type { BuildRequest } from '@/types'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('buildService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('triggerBuild', () => {
    it('should send build request to API', async () => {
      const axios = await import('axios')
      const mockResponse = {
        data: {
          success: true,
          message: 'Build completed successfully',
          logs: ['pdflatex started', 'Build successful'],
          outputPath: '/tex/output.pdf',
        },
      }
      
      vi.mocked(axios.default.post).mockResolvedValue(mockResponse)

      const request: BuildRequest = {
        sourceFile: 'main.tex',
        outputDir: 'tex',
      }

      const result = await buildService.triggerBuild(request)

      expect(axios.default.post).toHaveBeenCalledWith('/api/build', request)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Build completed successfully')
      expect(result.logs).toHaveLength(2)
    })

    it('should handle build errors', async () => {
      const axios = await import('axios')
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Build failed',
            logs: ['Error: Missing \\end{document}'],
          },
        },
      }
      
      vi.mocked(axios.default.post).mockRejectedValue(mockError)

      const request: BuildRequest = {
        sourceFile: 'main.tex',
        outputDir: 'tex',
      }

      await expect(buildService.triggerBuild(request)).rejects.toThrow()
    })

    it('should use custom command when provided', async () => {
      const axios = await import('axios')
      const mockResponse = {
        data: {
          success: true,
          message: 'Build completed',
          logs: [],
        },
      }
      
      vi.mocked(axios.default.post).mockResolvedValue(mockResponse)

      const request: BuildRequest = {
        sourceFile: 'main.tex',
        outputDir: 'tex',
        command: 'xelatex',
      }

      await buildService.triggerBuild(request)

      expect(axios.default.post).toHaveBeenCalledWith('/api/build', 
        expect.objectContaining({ command: 'xelatex' })
      )
    })
  })

  describe('getBuildStatus', () => {
    it('should fetch current build status', async () => {
      const axios = await import('axios')
      const mockResponse = {
        data: {
          isBuilding: true,
          success: null,
          error: null,
        },
      }
      
      vi.mocked(axios.default.get).mockResolvedValue(mockResponse)

      const status = await buildService.getBuildStatus()

      expect(axios.default.get).toHaveBeenCalledWith('/api/build/status')
      expect(status.isBuilding).toBe(true)
    })
  })

  describe('getPdfUrl', () => {
    it('should return correct PDF URL', () => {
      const url = buildService.getPdfUrl()
      expect(url).toMatch(/^\/api\/pdf\?t=\d+$/)
    })

    it('should add timestamp to prevent caching', async () => {
      const url1 = buildService.getPdfUrl()
      
      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const url2 = buildService.getPdfUrl()
      
      // URLs should be different due to timestamp
      expect(url1).not.toBe(url2)
    })
  })
})
