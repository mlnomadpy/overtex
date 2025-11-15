<script setup lang="ts">
import { FileText, Settings, HelpCircle, PanelLeftClose, PanelLeftOpen, Terminal, RotateCw, FolderOpen, Save } from 'lucide-vue-next'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from './ui/menubar'
import { Button } from './ui/button'
import { useBuild } from '@/composables/useBuild'
import { toast } from 'vue-sonner'

interface Props {
  sidebarVisible: boolean
  logsVisible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  toggleSidebar: []
  toggleLogs: []
}>()

const { triggerBuild, isBuilding } = useBuild()

const handleQuickBuild = async () => {
  toast.info('Building LaTeX document...')
  await triggerBuild('main.tex', 'tex')
}
</script>

<template>
  <div class="border-b bg-background flex items-center justify-between px-2 py-1">
    <!-- Left: Application Title and Menu -->
    <div class="flex items-center gap-2">
      <!-- App Title -->
      <div class="flex items-center gap-2 px-3 py-1">
        <FileText class="h-5 w-5 text-primary" />
        <span class="font-semibold text-lg">OverTeX</span>
      </div>

      <!-- Menu Bar -->
      <Menubar class="border-0">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <FolderOpen class="mr-2 h-4 w-4" />
              Open Project
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Save class="mr-2 h-4 w-4" />
              Save
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Recent Files
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Exit
              <MenubarShortcut>⌘Q</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo
              <MenubarShortcut>⌘⇧Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Cut
              <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Copy
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Paste
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem @click="emit('toggleSidebar')">
              <component :is="sidebarVisible ? PanelLeftClose : PanelLeftOpen" class="mr-2 h-4 w-4" />
              Toggle Sidebar
              <MenubarShortcut>⌘B</MenubarShortcut>
            </MenubarItem>
            <MenubarItem @click="emit('toggleLogs')">
              <Terminal class="mr-2 h-4 w-4" />
              Toggle Logs
              <MenubarShortcut>⌘J</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Zoom In
              <MenubarShortcut>⌘+</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Zoom Out
              <MenubarShortcut>⌘-</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Reset Zoom
              <MenubarShortcut>⌘0</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Build</MenubarTrigger>
          <MenubarContent>
            <MenubarItem @click="handleQuickBuild" :disabled="isBuilding">
              <RotateCw class="mr-2 h-4 w-4" />
              Build PDF
              <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Build and Clean
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Build Settings
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <HelpCircle class="mr-2 h-4 w-4" />
              Documentation
            </MenubarItem>
            <MenubarItem>
              Keyboard Shortcuts
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              About OverTeX
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>

    <!-- Right: Quick Actions -->
    <div class="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        @click="handleQuickBuild"
        :disabled="isBuilding"
      >
        <RotateCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': isBuilding }" />
        Build
      </Button>
      <Button variant="ghost" size="sm">
        <Settings class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
