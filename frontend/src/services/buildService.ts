import axios from 'axios'
import type { BuildRequest, BuildResponse, BuildStatus } from '@/types'

class BuildService {
  async triggerBuild(request: BuildRequest): Promise<BuildResponse> {
    try {
      const response = await axios.post<BuildResponse>('/api/build', request)
      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Build failed')
      }
      throw error
    }
  }

  async getBuildStatus(): Promise<BuildStatus> {
    const response = await axios.get<BuildStatus>('/api/build/status')
    return response.data
  }

  getPdfUrl(): string {
    // Add timestamp to prevent caching
    return `/api/pdf?t=${Date.now()}`
  }
}

export const buildService = new BuildService()
