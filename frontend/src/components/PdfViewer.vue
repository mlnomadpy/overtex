<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { VPdfViewer } from '@vue-pdf-viewer/viewer'

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
  <div class="pdf-viewer h-full bg-gray-50">
    <div v-if="!pdfUrl" class="flex items-center justify-center h-full">
      <div class="text-center max-w-md">
        <p class="text-gray-600">No PDF loaded</p>
        <p class="text-sm text-gray-600 mt-2">
          Build your LaTeX document to generate a PDF
        </p>
      </div>
    </div>

    <div v-else-if="error" class="flex items-center justify-center h-full">
      <div class="text-center max-w-md">
        <p class="text-red-700 font-semibold mb-2">Failed to load PDF</p>
        <p class="text-sm text-gray-600">{{ error }}</p>
      </div>
    </div>

    <VPdfViewer
      v-else
      ref="viewerRef"
      :src="pdfSrc"
      @document-load="handleDocumentLoad"
      @document-error="handleDocumentError"
    />
  </div>
</template>

<style scoped>
.pdf-viewer {
  height: 100%;
}
</style>
