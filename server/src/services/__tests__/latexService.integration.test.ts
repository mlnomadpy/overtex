import { describe, it, expect, beforeAll } from 'vitest'
import { latexService } from '../latexService'
import { existsSync } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

describe('latexService integration tests', () => {
  let isLatexInstalled = false

  beforeAll(async () => {
    // Check if latexmk is installed
    isLatexInstalled = await latexService.checkLatexInstalled()
    if (!isLatexInstalled) {
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

  it('should build real LaTeX document', async () => {
    if (!isLatexInstalled) {
      console.warn('Skipping test - LaTeX not installed')
      return
    }

    const result = await latexService.build('main.tex', 'tex')

    console.log('Build result:', result)

    expect(result.success).toBe(true)
    expect(result.message).toContain('success')
    expect(result.logs.length).toBeGreaterThan(0)
    
    // Check that PDF was created
    if (result.outputPath) {
      expect(existsSync(result.outputPath)).toBe(true)
    }
  }, 30000)
})
