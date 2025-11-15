import { ref } from 'vue'
import { buildService } from '@/services/buildService'
import type { BuildRequest } from '@/types'

export function useBuild() {
  const isBuilding = ref(false)
  const buildSuccess = ref<boolean | null>(null)
  const buildError = ref<string | null>(null)
  const buildLogs = ref<string[]>([])

  const triggerBuild = async (
    sourceFile: string,
    outputDir: string,
    command?: string
  ): Promise<void> => {
    // Prevent concurrent builds
    if (isBuilding.value) {
      return
    }

    isBuilding.value = true
    buildSuccess.value = null
    buildError.value = null
    buildLogs.value = []

    try {
      const request: BuildRequest = {
        sourceFile,
        outputDir,
        ...(command && { command }),
      }

      const response = await buildService.triggerBuild(request)

      buildSuccess.value = response.success
      buildLogs.value = response.logs
    } catch (error: any) {
      buildSuccess.value = false
      buildError.value = error.message || 'Build failed'
    } finally {
      isBuilding.value = false
    }
  }

  const clearLogs = () => {
    buildLogs.value = []
  }

  const resetBuildState = () => {
    buildSuccess.value = null
    buildError.value = null
    buildLogs.value = []
  }

  return {
    isBuilding,
    buildSuccess,
    buildError,
    buildLogs,
    triggerBuild,
    clearLogs,
    resetBuildState,
  }
}
