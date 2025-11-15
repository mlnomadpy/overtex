<script setup lang="ts">
import { computed } from 'vue'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useBuild } from '@/composables/useBuild'
import { buildService } from '@/services/buildService'

interface Props {
  onBuildComplete?: () => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  buildComplete: [pdfUrl: string]
}>()

const { isBuilding, buildSuccess, buildError, buildLogs, triggerBuild } = useBuild()

const statusText = computed(() => {
  if (isBuilding.value) return 'Building...'
  if (buildSuccess.value === true) return 'Build Successful'
  if (buildSuccess.value === false) return 'Build Failed'
  return 'Ready'
})

const statusClass = computed(() => {
  if (isBuilding.value) return 'text-blue-600'
  if (buildSuccess.value === true) return 'text-green-600'
  if (buildSuccess.value === false) return 'text-red-600'
  return 'text-gray-600'
})

const handleBuild = async () => {
  await triggerBuild('main.tex', 'tex')
  
  if (buildSuccess.value) {
    const pdfUrl = buildService.getPdfUrl()
    emit('buildComplete', pdfUrl)
  }
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg">Build Controls</CardTitle>
        <span :class="['text-sm font-semibold', statusClass]">
          {{ statusText }}
        </span>
      </div>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <Button
            @click="handleBuild"
            :disabled="isBuilding"
            class="flex items-center gap-2"
          >
            <span v-if="isBuilding" class="animate-spin">⟳</span>
            <span v-else>🔨</span>
            {{ isBuilding ? 'Building...' : 'Refresh PDF' }}
          </Button>

          <div class="text-sm text-gray-600">
            Source: <code class="bg-gray-100 px-2 py-1 rounded">tex/main.tex</code>
          </div>
        </div>

        <div v-if="buildError" class="p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-700 font-semibold">{{ buildError }}</p>
        </div>

        <div v-if="buildSuccess" class="p-3 bg-green-50 border border-green-200 rounded-md">
          <p class="text-sm text-green-700">
            ✓ PDF generated successfully
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
