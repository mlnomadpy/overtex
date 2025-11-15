<script setup lang="ts">
import { ref } from 'vue'
import PdfViewer from './components/PdfViewer.vue'
import BuildPanel from './components/BuildPanel.vue'
import LogViewer from './components/LogViewer.vue'

const pdfUrl = ref<string | null>(null)
const pdfViewerRef = ref<InstanceType<typeof PdfViewer> | null>(null)

const handleBuildComplete = (newPdfUrl: string) => {
  pdfUrl.value = newPdfUrl
  // Reload the PDF viewer
  setTimeout(() => {
    pdfViewerRef.value?.reload()
  }, 100)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="border-b bg-white">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">OverTeX</h1>
            <p class="text-sm text-gray-600">Local LaTeX Live Preview</p>
          </div>
          <div class="text-xs text-gray-500">
            v1.0.0
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <div class="grid gap-6">
        <!-- Build Controls -->
        <BuildPanel @build-complete="handleBuildComplete" />

        <!-- PDF Viewer -->
        <div class="border rounded-lg overflow-hidden bg-white" style="height: 70vh">
          <PdfViewer ref="pdfViewerRef" :pdf-url="pdfUrl" />
        </div>

        <!-- Logs -->
        <LogViewer />
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t mt-8 bg-white">
      <div class="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
        <p>
          Edit <code class="bg-gray-100 px-2 py-1 rounded font-mono text-xs">tex/main.tex</code> and click "Refresh PDF" to see changes
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
code {
  font-family: 'Courier New', monospace;
}
</style>

