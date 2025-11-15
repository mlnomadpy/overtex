<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, XCircle, Loader2, Circle } from 'lucide-vue-next'
import { useBuild } from '@/composables/useBuild'

const { isBuilding, buildSuccess, buildError } = useBuild()

const statusIcon = computed(() => {
  if (isBuilding.value) return Loader2
  if (buildSuccess.value === true) return CheckCircle2
  if (buildSuccess.value === false) return XCircle
  return Circle
})

const statusText = computed(() => {
  if (isBuilding.value) return 'Building...'
  if (buildSuccess.value === true) return 'Build Successful'
  if (buildSuccess.value === false) return 'Build Failed'
  return 'Ready'
})

const statusClass = computed(() => {
  if (isBuilding.value) return 'text-blue-500'
  if (buildSuccess.value === true) return 'text-green-500'
  if (buildSuccess.value === false) return 'text-red-500'
  return 'text-muted-foreground'
})
</script>

<template>
  <div class="border-t bg-background px-3 md:px-4 py-1 flex items-center justify-between text-xs">
    <!-- Left: Status -->
    <div class="flex items-center gap-2 md:gap-4">
      <div class="flex items-center gap-1 md:gap-2" :class="statusClass">
        <component :is="statusIcon" class="h-3 w-3" :class="{ 'animate-spin': isBuilding }" />
        <span class="font-medium hidden sm:inline">{{ statusText }}</span>
      </div>
      
      <div v-if="buildError" class="text-red-500 max-w-[120px] md:max-w-md truncate hidden sm:block">
        {{ buildError }}
      </div>
    </div>

    <!-- Right: Info -->
    <div class="flex items-center gap-2 md:gap-4 text-muted-foreground">
      <div class="flex items-center gap-1 hidden md:flex">
        <span>LaTeX</span>
      </div>
      <div class="flex items-center gap-1 hidden md:flex">
        <span>UTF-8</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="hidden sm:inline">OverTeX </span>
        <span>v1.0.0</span>
      </div>
    </div>
  </div>
</template>
