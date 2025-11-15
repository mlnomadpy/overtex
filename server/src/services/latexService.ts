import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execPromise = promisify(exec)

export interface BuildResult {
  success: boolean
  message: string
  logs: string[]
  outputPath?: string
}

class LatexService {
  private readonly workspaceRoot = '/workspaces/overtex'
  private readonly buildTimeout = 60000 // 60 seconds

  async build(
    sourceFile: string,
    outputDir: string,
    command: string = 'latexmk'
  ): Promise<BuildResult> {
    try {
      // Validate inputs
      this.validatePath(sourceFile)
      this.validatePath(outputDir)

      const absoluteOutputDir = path.join(this.workspaceRoot, outputDir)
      const absoluteSourcePath = path.join(absoluteOutputDir, sourceFile)

      // Build command based on the tool
      let buildCommand: string
      if (command === 'latexmk') {
        buildCommand = `latexmk -pdf -interaction=nonstopmode -output-directory=${absoluteOutputDir} ${absoluteSourcePath}`
      } else {
        buildCommand = `${command} -interaction=nonstopmode -output-directory=${absoluteOutputDir} ${absoluteSourcePath}`
      }

      const { stdout, stderr } = await execPromise(buildCommand, {
        timeout: this.buildTimeout,
        cwd: absoluteOutputDir,
      })

      const logs = this.parseLogs(stdout + stderr)
      const outputPath = this.getPdfPath(sourceFile, outputDir)

      return {
        success: true,
        message: 'Build completed successfully',
        logs,
        outputPath,
      }
    } catch (error: any) {
      const logs = this.parseLogs(error.stdout || error.stderr || error.message || '')

      return {
        success: false,
        message: `Build failed: ${error.message}`,
        logs,
      }
    }
  }

  validatePath(filePath: string): void {
    // Prevent path traversal attacks
    if (filePath.includes('..') || filePath.includes(';') || filePath.includes('|')) {
      throw new Error('Invalid file path: potential security risk detected')
    }
  }

  parseLogs(output: string): string[] {
    return output
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
  }

  getPdfPath(sourceFile: string, outputDir: string): string {
    const baseName = path.basename(sourceFile, '.tex')
    return path.join(this.workspaceRoot, outputDir, `${baseName}.pdf`)
  }

  async checkLatexInstalled(): Promise<boolean> {
    try {
      await execPromise('latexmk --version')
      return true
    } catch {
      return false
    }
  }
}

export const latexService = new LatexService()
