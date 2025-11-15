<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useBuild } from '@/composables/useBuild'

const { buildLogs, clearLogs } = useBuild()
const isExpanded = ref(false)

const hasLogs = computed(() => buildLogs.value.length > 0)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <CardTitle class="text-lg">Build Logs</CardTitle>
          <span v-if="hasLogs" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {{ buildLogs.length }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <Button
            v-if="hasLogs"
            @click="clearLogs"
            variant="ghost"
            size="sm"
          >
            Clear
          </Button>
          <Button
            @click="toggleExpanded"
            variant="ghost"
            size="sm"
          >
            {{ isExpanded ? '▼' : '▶' }}
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent v-if="isExpanded">
      <div
        v-if="hasLogs"
        class="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto font-mono text-xs"
      >
        <div v-for="(log, index) in buildLogs" :key="index" class="mb-1">
          {{ log }}
        </div>
      </div>
      <div v-else class="text-sm text-gray-600 text-center py-4">
        No logs yet. Click "Refresh PDF" to build your document.
      </div>
    </CardContent>
  </Card>
</template>
