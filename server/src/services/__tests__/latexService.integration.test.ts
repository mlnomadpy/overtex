import { describe, it, expect, beforeAll } from 'vitest'
import { latexService } from '../latexService'
import { existsSync } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

describe('latexService integration tests', () => {
  beforeAll(async () => {
    // Check if latexmk is installed
    const isInstalled = await latexService.checkLatexInstalled()
    if (!isInstalled) {
      console.warn('⚠️  latexmk not installed - skipping integration tests')
      console.warn('Run: sudo apt install texlive-latex-base latexmk')
    }
  })

  it('should validate paths correctly', () => {
    expect(() => latexService.validatePath('main.tex')).not.toThrow()
    expect(() => latexService.validatePath('../etc/passwd')).toThrow()
    expect(() => latexService.validatePath('file; rm -rf /')).toThrow()
  })

  it('should parse logs correctly', () => {
    const sampleLog = `This is pdfTeX
Output written on main.pdf (1 page).
Transcript written on main.log.`

    const parsed = latexService.parseLogs(sampleLog)
    expect(parsed).toHaveLength(3)
    expect(parsed).toContain('This is pdfTeX')
  })

  it('should return correct PDF path', () => {
    const pdfPath = latexService.getPdfPath('main.tex', 'tex')
    expect(pdfPath).toContain('/workspaces/overtex/tex/output.pdf')
  })

  it.skipIf(!(await latexService.checkLatexInstalled()))(
    'should build real LaTeX document',
    async () => {
      const result = await latexService.build('main.tex', 'tex')

      console.log('Build result:', result)

      expect(result.success).toBe(true)
      expect(result.message).toContain('success')
      expect(result.logs.length).toBeGreaterThan(0)
      
      // Check that PDF was created
      if (result.outputPath) {
        expect(existsSync(result.outputPath)).toBe(true)
      }
    },
    { timeout: 30000 }
  )
})
