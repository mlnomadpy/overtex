<script setup lang="ts">
import { Menu, FileText, Terminal, RotateCw, Settings } from 'lucide-vue-next'
import { Button } from './ui/button'
import { useBuild } from '@/composables/useBuild'
import { buildService } from '@/services/buildService'
import { toast } from 'vue-sonner'

const emit = defineEmits<{
  toggleSidebar: []
  toggleLogs: []
  buildComplete: [pdfUrl: string]
}>()

const { triggerBuild, isBuilding, buildSuccess } = useBuild()

const handleQuickBuild = async () => {
  toast.info('Building LaTeX document...')
  await triggerBuild('main.tex', 'tex')
  
  if (buildSuccess.value) {
    const pdfUrl = buildService.getPdfUrl()
    emit('buildComplete', pdfUrl)
    toast.success('Build completed!')
  }
}
</script>

<template>
  <div class="border-b bg-background flex items-center justify-between px-3 py-2">
    <!-- Left: Menu and Title -->
    <div class="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        @click="emit('toggleSidebar')"
        class="h-8 w-8 p-0"
      >
        <Menu class="h-5 w-5" />
      </Button>
      
      <div class="flex items-center gap-2">
        <FileText class="h-5 w-5 text-primary" />
        <span class="font-semibold text-base">OverTeX</span>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        @click="handleQuickBuild"
        :disabled="isBuilding"
        class="h-8 w-8 p-0"
      >
        <RotateCw class="h-4 w-4" :class="{ 'animate-spin': isBuilding }" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="emit('toggleLogs')"
        class="h-8 w-8 p-0"
      >
        <Terminal class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
