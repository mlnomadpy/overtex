<script setup lang="ts">
import { computed } from 'vue'
import { Terminal, Trash2, Copy, AlertCircle } from 'lucide-vue-next'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'
import { useBuild } from '@/composables/useBuild'
import { toast } from 'vue-sonner'

const { buildLogs, clearLogs } = useBuild()

const hasLogs = computed(() => buildLogs.value.length > 0)

const copyLogs = () => {
  const logsText = buildLogs.value.join('\n')
  navigator.clipboard.writeText(logsText)
  toast.success('Logs copied to clipboard')
}

const logType = (log: string) => {
  if (log.includes('Error') || log.includes('error') || log.includes('!')) return 'error'
  if (log.includes('Warning') || log.includes('warning')) return 'warning'
  return 'info'
}
</script>

<template>
  <div class="h-full flex flex-col bg-background">
    <!-- Header -->
    <div class="border-b px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Terminal class="h-4 w-4 text-muted-foreground" />
        <h3 class="text-sm font-semibold">Build Output</h3>
        <Badge v-if="hasLogs" variant="secondary" class="text-xs">
          {{ buildLogs.length }}
        </Badge>
      </div>
      <div class="flex items-center gap-1">
        <Button
          v-if="hasLogs"
          variant="ghost"
          size="sm"
          @click="copyLogs"
        >
          <Copy class="h-3 w-3" />
        </Button>
        <Button
          v-if="hasLogs"
          variant="ghost"
          size="sm"
          @click="clearLogs"
        >
          <Trash2 class="h-3 w-3" />
        </Button>
      </div>
    </div>

    <!-- Log Content -->
    <ScrollArea class="flex-1">
      <div v-if="!hasLogs" class="h-full flex items-center justify-center p-8">
        <div class="text-center text-muted-foreground">
          <Terminal class="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p class="text-sm">No build output yet</p>
          <p class="text-xs mt-1">Run a build to see the LaTeX compiler logs</p>
        </div>
      </div>
      
      <div v-else class="p-4 space-y-1 font-mono text-xs">
        <div
          v-for="(log, index) in buildLogs"
          :key="index"
          class="py-0.5"
          :class="{
            'text-red-600': logType(log) === 'error',
            'text-yellow-600': logType(log) === 'warning',
            'text-foreground/80': logType(log) === 'info'
          }"
        >
          <span v-if="logType(log) === 'error'" class="inline-block w-4 mr-1">❌</span>
          <span v-else-if="logType(log) === 'warning'" class="inline-block w-4 mr-1">⚠️</span>
          <span v-else class="inline-block w-4 mr-1 opacity-30">›</span>
          {{ log }}
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
