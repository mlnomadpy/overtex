import { describe, it, expect, vi, beforeEach } from 'vitest'
import { latexService } from '../latexService'
import * as cp from 'child_process'

// Mock child_process
vi.mock('child_process')

describe('latexService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('build', () => {
    it('should execute latexmk command successfully', async () => {
      const mockExec = vi.spyOn(cp, 'exec').mockImplementation((cmd: any, options: any, callback: any) => {
        const cb = typeof options === 'function' ? options : callback
        cb(null, 'Build successful\nOutput written to output.pdf', '')
        return {} as any
      })

      const result = await latexService.build('main.tex', 'tex')

      expect(result.success).toBe(true)
      expect(result.logs).toContain('Build successful')
      expect(mockExec).toHaveBeenCalled()
      
      const callArgs = mockExec.mock.calls[0][0] as string
      expect(callArgs).toContain('latexmk')
      expect(callArgs).toContain('main.tex')
    })

    it('should handle compilation errors', async () => {
      vi.spyOn(cp, 'exec').mockImplementation((cmd: any, options: any, callback: any) => {
        const cb = typeof options === 'function' ? options : callback
        const error: any = new Error('Compilation failed')
        error.stdout = ''
        error.stderr = 'Error: Missing \\end{document}'
        cb(error, '', 'Error: Missing \\end{document}')
        return {} as any
      })

      const result = await latexService.build('main.tex', 'tex')

      expect(result.success).toBe(false)
      expect(result.message).toContain('failed')
      expect(result.logs).toContain('Error: Missing \\end{document}')
    })

    it('should use custom command when provided', async () => {
      const mockExec = vi.spyOn(cp, 'exec').mockImplementation((cmd: any, options: any, callback: any) => {
        const cb = typeof options === 'function' ? options : callback
        cb(null, 'Build successful', '')
        return {} as any
      })

      await latexService.build('main.tex', 'tex', 'xelatex')

      const callArgs = mockExec.mock.calls[0][0] as string
      expect(callArgs).toContain('xelatex')
    })

    it('should use absolute paths', async () => {
      const mockExec = vi.spyOn(cp, 'exec').mockImplementation((cmd: any, options: any, callback: any) => {
        const cb = typeof options === 'function' ? options : callback
        cb(null, 'Build successful', '')
        return {} as any
      })

      await latexService.build('main.tex', 'tex')

      const callArgs = mockExec.mock.calls[0][0] as string
      expect(callArgs).toMatch(/\/workspaces\/overtex\/tex/)
    })

    it('should sanitize file paths to prevent injection', () => {
      const maliciousPath = '../../../etc/passwd; rm -rf /'
      expect(() => {
        latexService.validatePath(maliciousPath)
      }).toThrow()
    })

    it('should parse LaTeX logs correctly', () => {
      const logs = `This is pdfTeX, Version 3.14159265-2.6-1.40.21
Output written on main.pdf (1 page, 12345 bytes).
Transcript written on main.log.`

      const parsed = latexService.parseLogs(logs)

      expect(parsed).toContain('Output written on main.pdf (1 page, 12345 bytes).')
      expect(parsed).toHaveLength(3)
    })
  })

  describe('getPdfPath', () => {
    it('should return correct PDF path', () => {
      const path = latexService.getPdfPath('main.tex', 'tex')
      expect(path).toMatch(/\/workspaces\/overtex\/tex\/output\.pdf$/)
    })
  })

  describe('checkLatexInstalled', () => {
    it('should verify latexmk is installed', async () => {
      const mockExec = vi.spyOn(cp, 'exec').mockImplementation((cmd: any, callback: any) => {
        callback(null, 'Latexmk, John Collins, 18 Jun. 2021. Version 4.75', '')
        return {} as any
      })

      const isInstalled = await latexService.checkLatexInstalled()

      expect(isInstalled).toBe(true)
    })

    it('should return false if latexmk not found', async () => {
      vi.spyOn(cp, 'exec').mockImplementation((cmd: any, callback: any) => {
        callback(new Error('command not found'), '', '')
        return {} as any
      })

      const isInstalled = await latexService.checkLatexInstalled()

      expect(isInstalled).toBe(false)
    })
  })
})
