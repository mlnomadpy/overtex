<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PdfViewer from './components/PdfViewer.vue'
import LogViewer from './components/LogViewer.vue'
import Menubar from './components/Menubar.vue'
import MobileMenubar from './components/MobileMenubar.vue'
import Statusbar from './components/Statusbar.vue'
import Sidebar from './components/Sidebar.vue'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable'
import { Sheet, SheetContent } from './components/ui/sheet'
import { Toaster } from './components/ui/sonner'

const pdfUrl = ref<string | null>(null)
const pdfViewerRef = ref<InstanceType<typeof PdfViewer> | null>(null)
const showSidebar = ref(true)
const showLogs = ref(true)
const isMobile = ref(false)
const mobileSheetOpen = ref(false)

// Detect mobile screen size
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  // Auto-hide sidebar and logs on mobile
  if (isMobile.value) {
    showSidebar.value = false
    showLogs.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const handleBuildComplete = (newPdfUrl: string) => {
  pdfUrl.value = newPdfUrl
  // Reload the PDF viewer
  setTimeout(() => {
    pdfViewerRef.value?.reload()
  }, 100)
}

const toggleSidebar = () => {
  if (isMobile.value) {
    mobileSheetOpen.value = !mobileSheetOpen.value
  } else {
    showSidebar.value = !showSidebar.value
  }
}

const toggleLogs = () => {
  showLogs.value = !showLogs.value
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col overflow-hidden bg-background">
    <!-- Desktop Menubar -->
    <Menubar 
      v-if="!isMobile"
      @toggle-sidebar="toggleSidebar" 
      @toggle-logs="toggleLogs"
      :sidebar-visible="showSidebar"
      :logs-visible="showLogs"
    />
    
    <!-- Mobile Menubar -->
    <MobileMenubar
      v-else
      @toggle-sidebar="toggleSidebar"
      @toggle-logs="toggleLogs"
      @build-complete="handleBuildComplete"
    />

    <!-- Main Content Area with Resizable Panels (Desktop) -->
    <div v-if="!isMobile" class="flex-1 flex overflow-hidden">
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

    <!-- Mobile Layout (Stacked) -->
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <!-- PDF Viewer (Full Height on Mobile) -->
      <div class="flex-1 overflow-hidden" v-show="!showLogs">
        <PdfViewer ref="pdfViewerRef" :pdf-url="pdfUrl" />
      </div>

      <!-- Logs (Full Height when visible) -->
      <div class="flex-1 overflow-hidden" v-show="showLogs">
        <LogViewer />
      </div>
    </div>

    <!-- Mobile Sidebar Sheet -->
    <Sheet v-model:open="mobileSheetOpen">
      <SheetContent side="left" class="w-[80vw] p-0">
        <Sidebar @build-complete="handleBuildComplete" />
      </SheetContent>
    </Sheet>

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

/* Custom scrollbar for logs and sidebar (desktop) */
@media (min-width: 768px) {
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
}

/* Touch-friendly scrolling on mobile */
@media (max-width: 767px) {
  * {
    -webkit-overflow-scrolling: touch;
  }
  
  /* Larger touch targets on mobile */
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
}
</style>
