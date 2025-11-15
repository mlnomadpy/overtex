export interface BuildStatus {
  isBuilding: boolean
  success: boolean | null
  error: string | null
  logs: string[]
}

export interface PdfViewerState {
  pdfUrl: string | null
  currentPage: number
  totalPages: number
  zoom: number
  isLoading: boolean
  error: string | null
}

export interface BuildResponse {
  success: boolean
  message: string
  logs: string[]
  outputPath?: string
}

export interface BuildRequest {
  sourceFile: string
  outputDir: string
  command?: string
}
