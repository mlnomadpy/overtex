import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBuild } from '../useBuild'
import { buildService } from '@/services/buildService'

// Mock buildService
vi.mock('@/services/buildService', () => ({
  buildService: {
    triggerBuild: vi.fn(),
    getBuildStatus: vi.fn(),
    getPdfUrl: vi.fn(),
  },
}))

describe('useBuild', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { isBuilding, buildError, buildLogs, buildSuccess } = useBuild()

    expect(isBuilding.value).toBe(false)
    expect(buildError.value).toBe(null)
    expect(buildLogs.value).toEqual([])
    expect(buildSuccess.value).toBe(null)
  })

  it('should trigger build and update state on success', async () => {
    const mockResponse = {
      success: true,
      message: 'Build completed',
      logs: ['Build started', 'Compilation successful'],
      outputPath: '/tex/output.pdf',
    }

    vi.mocked(buildService.triggerBuild).mockResolvedValue(mockResponse)

    const { triggerBuild, isBuilding, buildSuccess, buildLogs } = useBuild()

    const promise = triggerBuild('main.tex', 'tex')

    expect(isBuilding.value).toBe(true)

    await promise

    expect(isBuilding.value).toBe(false)
    expect(buildSuccess.value).toBe(true)
    expect(buildLogs.value).toEqual(['Build started', 'Compilation successful'])
  })

  it('should handle build errors', async () => {
    vi.mocked(buildService.triggerBuild).mockRejectedValue(
      new Error('Build failed: Missing \\end{document}')
    )

    const { triggerBuild, isBuilding, buildError, buildSuccess } = useBuild()

    await triggerBuild('main.tex', 'tex')

    expect(isBuilding.value).toBe(false)
    expect(buildSuccess.value).toBe(false)
    expect(buildError.value).toContain('Build failed')
  })

  it('should clear logs', () => {
    const { buildLogs, clearLogs } = useBuild()

    buildLogs.value = ['Log 1', 'Log 2', 'Log 3']
    clearLogs()

    expect(buildLogs.value).toEqual([])
  })

  it('should reset build state', () => {
    const { buildSuccess, buildError, buildLogs, resetBuildState } = useBuild()

    buildSuccess.value = true
    buildError.value = 'Some error'
    buildLogs.value = ['Log 1']

    resetBuildState()

    expect(buildSuccess.value).toBe(null)
    expect(buildError.value).toBe(null)
    expect(buildLogs.value).toEqual([])
  })

  it('should prevent concurrent builds', async () => {
    vi.mocked(buildService.triggerBuild).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        message: 'Done',
        logs: [],
      }), 100))
    )

    const { triggerBuild, isBuilding } = useBuild()

    const promise1 = triggerBuild('main.tex', 'tex')
    const promise2 = triggerBuild('main.tex', 'tex')

    expect(isBuilding.value).toBe(true)

    // Second call should be ignored
    await Promise.all([promise1, promise2])

    // Should only be called once
    expect(buildService.triggerBuild).toHaveBeenCalledTimes(1)
  })

  it('should use custom command if provided', async () => {
    vi.mocked(buildService.triggerBuild).mockResolvedValue({
      success: true,
      message: 'Done',
      logs: [],
    })

    const { triggerBuild } = useBuild()

    await triggerBuild('main.tex', 'tex', 'xelatex')

    expect(buildService.triggerBuild).toHaveBeenCalledWith({
      sourceFile: 'main.tex',
      outputDir: 'tex',
      command: 'xelatex',
    })
  })
})
