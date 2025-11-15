<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { VPdfViewer } from '@vue-pdf-viewer/viewer'
import { FileText, AlertCircle } from 'lucide-vue-next'

interface Props {
  pdfUrl: string | null
  onLoad?: () => void
  onError?: (error: Error) => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  load: []
  error: [error: Error]
}>()

const viewerRef = ref<InstanceType<typeof VPdfViewer> | null>(null)
const error = ref<string | null>(null)

// Add timestamp to force reload
const pdfSrc = computed(() => {
  if (!props.pdfUrl) return null
  return `${props.pdfUrl}?t=${Date.now()}`
})

const handleDocumentLoad = () => {
  error.value = null
  emit('load')
}

const handleDocumentError = (err: any) => {
  error.value = err?.message || 'Failed to load PDF'
  emit('error', err)
}

const reload = () => {
  error.value = null
  // Component will auto-reload when pdfSrc changes
}

watch(() => props.pdfUrl, () => {
  error.value = null
})

defineExpose({
  reload
})
</script>

<template>
  <div class="pdf-viewer h-full w-full bg-muted/10 flex items-center justify-center">
    <!-- No PDF State -->
    <div v-if="!pdfUrl" class="text-center max-w-md px-8">
      <FileText class="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
      <h3 class="text-lg font-semibold mb-2">No PDF Loaded</h3>
      <p class="text-sm text-muted-foreground">
        Build your LaTeX document to generate and view a PDF
      </p>
      <p class="text-xs text-muted-foreground mt-4">
        Click the "Build PDF" button in the sidebar or use <kbd class="px-2 py-1 text-xs bg-muted rounded">⌘R</kbd>
      </p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center max-w-md px-8">
      <AlertCircle class="h-16 w-16 mx-auto mb-4 text-destructive/50" />
      <h3 class="text-lg font-semibold mb-2 text-destructive">Failed to Load PDF</h3>
      <p class="text-sm text-muted-foreground">{{ error }}</p>
      <p class="text-xs text-muted-foreground mt-4">
        Check the build output for compilation errors
      </p>
    </div>

    <!-- PDF Viewer -->
    <VPdfViewer
      v-else
      ref="viewerRef"
      :src="pdfSrc"
      class="w-full h-full"
      @document-load="handleDocumentLoad"
      @document-error="handleDocumentError"
    />
  </div>
</template>

<style scoped>
.pdf-viewer {
  height: 100%;
  width: 100%;
}

kbd {
  font-family: ui-monospace, monospace;
  border: 1px solid hsl(var(--border));
}
</style>
