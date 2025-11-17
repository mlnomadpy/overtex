import axios from 'axios'
import type { BuildRequest, BuildResponse, BuildStatus } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

class BuildService {
  private getApiUrl(path: string): string {
    // In development, use proxy; in production, use full URL
    if (import.meta.env.DEV) {
      return path
    }
    return `${API_BASE_URL}${path}`
  }

  async triggerBuild(request: BuildRequest): Promise<BuildResponse> {
    try {
      const response = await axios.post<BuildResponse>(
        this.getApiUrl('/api/build'),
        request
      )
      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Build failed')
      }
      throw error
    }
  }

  async getBuildStatus(): Promise<BuildStatus> {
    const response = await axios.get<BuildStatus>(
      this.getApiUrl('/api/build/status')
    )
    return response.data
  }

  getPdfUrl(): string {
    // Add timestamp to prevent caching
    const path = `/api/pdf?t=${Date.now()}`
    return this.getApiUrl(path)
  }
}

export const buildService = new BuildService()
