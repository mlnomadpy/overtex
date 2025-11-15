<script setup lang="ts">
import { ref, computed } from 'vue'
import { FileText, FolderOpen, Settings, Clock, FileCheck } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useBuild } from '@/composables/useBuild'
import { buildService } from '@/services/buildService'
import { toast } from 'vue-sonner'

const emit = defineEmits<{
  buildComplete: [pdfUrl: string]
}>()

const { isBuilding, buildSuccess, buildError, triggerBuild } = useBuild()

const statusText = computed(() => {
  if (isBuilding.value) return 'Building'
  if (buildSuccess.value === true) return 'Success'
  if (buildSuccess.value === false) return 'Failed'
  return 'Ready'
})

const statusVariant = computed(() => {
  if (isBuilding.value) return 'secondary'
  if (buildSuccess.value === true) return 'default'
  if (buildSuccess.value === false) return 'destructive'
  return 'outline'
})

const handleBuild = async () => {
  toast.info('Building LaTeX document...', {
    description: 'tex/main.tex'
  })
  
  await triggerBuild('main.tex', 'tex')
  
  if (buildSuccess.value) {
    const pdfUrl = buildService.getPdfUrl()
    emit('buildComplete', pdfUrl)
    toast.success('Build completed successfully!', {
      description: 'PDF is ready to view'
    })
  } else if (buildError.value) {
    toast.error('Build failed', {
      description: buildError.value
    })
  }
}

// Mock recent files
const recentFiles = ref([
  { name: 'main.tex', path: 'tex/main.tex', lastModified: '2 minutes ago' },
  { name: 'chapter1.tex', path: 'tex/chapter1.tex', lastModified: '1 hour ago' },
  { name: 'references.bib', path: 'tex/references.bib', lastModified: '3 hours ago' },
])

const buildHistory = ref([
  { time: '2 minutes ago', status: 'success', duration: '1.2s' },
  { time: '10 minutes ago', status: 'success', duration: '1.5s' },
  { time: '1 hour ago', status: 'failed', duration: '0.8s' },
])
</script>

<template>
  <div class="h-full flex flex-col bg-background">
    <!-- Build Controls Section -->
    <div class="p-4 space-y-4">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold">Quick Actions</h2>
          <Badge :variant="statusVariant">{{ statusText }}</Badge>
        </div>
        
        <Button
          @click="handleBuild"
          :disabled="isBuilding"
          class="w-full"
          size="lg"
        >
          <FileCheck class="mr-2 h-5 w-5" :class="{ 'animate-pulse': isBuilding }" />
          {{ isBuilding ? 'Building...' : 'Build PDF' }}
        </Button>
      </div>

      <Separator />

      <!-- Source File Info -->
      <Card>
        <CardHeader class="p-3">
          <div class="flex items-start gap-2">
            <FileText class="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div class="flex-1 min-w-0">
              <CardTitle class="text-xs font-medium">Source File</CardTitle>
              <CardDescription class="text-xs mt-1 font-mono truncate">
                tex/main.tex
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>

    <!-- Tabs Section -->
    <div class="flex-1 overflow-hidden">
      <Tabs default-value="files" class="h-full flex flex-col">
        <TabsList class="w-full grid grid-cols-3 mx-4">
          <TabsTrigger value="files" class="text-xs">
            <FolderOpen class="h-3 w-3 mr-1" />
            Files
          </TabsTrigger>
          <TabsTrigger value="history" class="text-xs">
            <Clock class="h-3 w-3 mr-1" />
            History
          </TabsTrigger>
          <TabsTrigger value="settings" class="text-xs">
            <Settings class="h-3 w-3 mr-1" />
            Settings
          </TabsTrigger>
        </TabsList>

        <!-- Files Tab -->
        <TabsContent value="files" class="flex-1 overflow-hidden mt-2">
          <ScrollArea class="h-full px-4">
            <div class="space-y-2">
              <p class="text-xs font-semibold text-muted-foreground mb-2">Recent Files</p>
              <div
                v-for="file in recentFiles"
                :key="file.path"
                class="group flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
              >
                <FileText class="h-4 w-4 text-muted-foreground" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium truncate">{{ file.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ file.lastModified }}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <!-- History Tab -->
        <TabsContent value="history" class="flex-1 overflow-hidden mt-2">
          <ScrollArea class="h-full px-4">
            <div class="space-y-2">
              <p class="text-xs font-semibold text-muted-foreground mb-2">Build History</p>
              <div
                v-for="(build, index) in buildHistory"
                :key="index"
                class="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
              >
                <Badge 
                  :variant="build.status === 'success' ? 'default' : 'destructive'"
                  class="text-xs"
                >
                  {{ build.status }}
                </Badge>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-muted-foreground">{{ build.time }}</p>
                  <p class="text-xs font-mono">{{ build.duration }}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <!-- Settings Tab -->
        <TabsContent value="settings" class="flex-1 overflow-hidden mt-2">
          <ScrollArea class="h-full px-4">
            <div class="space-y-4">
              <div>
                <p class="text-xs font-semibold mb-2">Build Settings</p>
                <div class="space-y-2 text-xs text-muted-foreground">
                  <p>Compiler: pdflatex</p>
                  <p>Output: tex/</p>
                  <p>Timeout: 60s</p>
                </div>
              </div>
              <Separator />
              <div>
                <p class="text-xs font-semibold mb-2">Editor Settings</p>
                <div class="space-y-2 text-xs text-muted-foreground">
                  <p>Auto-save: Enabled</p>
                  <p>Syntax: LaTeX</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
