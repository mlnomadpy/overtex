<script setup lang="ts">
import { ref } from 'vue'
import PdfViewer from './components/PdfViewer.vue'
import LogViewer from './components/LogViewer.vue'
import Menubar from './components/Menubar.vue'
import Statusbar from './components/Statusbar.vue'
import Sidebar from './components/Sidebar.vue'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable'
import { Toaster } from './components/ui/sonner'

const pdfUrl = ref<string | null>(null)
const pdfViewerRef = ref<InstanceType<typeof PdfViewer> | null>(null)
const showSidebar = ref(true)
const showLogs = ref(true)

const handleBuildComplete = (newPdfUrl: string) => {
  pdfUrl.value = newPdfUrl
  // Reload the PDF viewer
  setTimeout(() => {
    pdfViewerRef.value?.reload()
  }, 100)
}

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const toggleLogs = () => {
  showLogs.value = !showLogs.value
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col overflow-hidden bg-background">
    <!-- Menubar -->
    <Menubar 
      @toggle-sidebar="toggleSidebar" 
      @toggle-logs="toggleLogs"
      :sidebar-visible="showSidebar"
      :logs-visible="showLogs"
    />

    <!-- Main Content Area with Resizable Panels -->
    <div class="flex-1 flex overflow-hidden">
      <ResizablePanelGroup direction="horizontal" class="h-full">
        <!-- Sidebar Panel -->
        <ResizablePanel
          v-if="showSidebar"
          :default-size="20"
          :min-size="15"
          :max-size="35"
          class="border-r"
        >
          <Sidebar @build-complete="handleBuildComplete" />
        </ResizablePanel>

        <ResizableHandle v-if="showSidebar" with-handle />

        <!-- Main Content Panel -->
        <ResizablePanel :default-size="showSidebar ? 80 : 100">
          <ResizablePanelGroup direction="vertical" class="h-full">
            <!-- PDF Viewer Panel -->
            <ResizablePanel 
              :default-size="showLogs ? 70 : 100"
              :min-size="30"
            >
              <div class="h-full w-full bg-muted/20">
                <PdfViewer ref="pdfViewerRef" :pdf-url="pdfUrl" />
              </div>
            </ResizablePanel>

            <!-- Resizable Handle between PDF and Logs -->
            <ResizableHandle v-if="showLogs" with-handle />

            <!-- Logs Panel -->
            <ResizablePanel 
              v-if="showLogs"
              :default-size="30"
              :min-size="15"
              :max-size="50"
            >
              <LogViewer />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>

    <!-- Statusbar -->
    <Statusbar />

    <!-- Toast Notifications -->
    <Toaster />
  </div>
</template>

<style>
/* Ensure no scrolling on body */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}

#app {
  height: 100vh;
  width: 100vw;
}

/* Custom scrollbar for logs and sidebar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--muted));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
