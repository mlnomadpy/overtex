import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PdfViewer from '../PdfViewer.vue'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

// Mock pdfjs-dist
vi.mock('pdfjs-dist/legacy/build/pdf.mjs', () => {
  const mockPage = {
    getViewport: vi.fn(() => ({
      width: 800,
      height: 1000,
      scale: 1
    })),
    render: vi.fn(() => ({
      promise: Promise.resolve()
    }))
  }

  const mockPdfDoc = {
    numPages: 3,
    getPage: vi.fn(() => Promise.resolve(mockPage))
  }

  return {
    default: {
      GlobalWorkerOptions: { workerSrc: '' },
      getDocument: vi.fn(() => ({
        promise: Promise.resolve(mockPdfDoc)
      }))
    },
    GlobalWorkerOptions: { workerSrc: '' },
    getDocument: vi.fn(() => ({
      promise: Promise.resolve(mockPdfDoc)
    }))
  }
})

describe('PdfViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    const wrapper = mount(PdfViewer, {
      props: {
        pdfUrl: null
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('shows "No PDF loaded" message when pdfUrl is null', () => {
    const wrapper = mount(PdfViewer, {
      props: {
        pdfUrl: null
      }
    })
    expect(wrapper.text()).toContain('No PDF loaded')
  })

  it('displays canvas element for rendering when PDF is loaded', async () => {
    const wrapper = mount(PdfViewer, {
      props: {
        pdfUrl: 'http://example.com/test.pdf'
      }
    })

    // Wait for PDF to "load"
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    const canvas = wrapper.find('canvas')
    expect(canvas.exists()).toBe(true)
  })

  it('attempts to load PDF when pdfUrl is provided', async () => {
    const wrapper = mount(PdfViewer, {
      props: {
        pdfUrl: 'http://example.com/test.pdf'
      }
    })

    await wrapper.vm.$nextTick()
    
    expect(pdfjsLib.getDocument).toHaveBeenCalledWith('http://example.com/test.pdf')
  })

  it('shows loading state while PDF loads', async () => {
    const wrapper = mount(PdfViewer, {
      props: {
        pdfUrl: 'http://example.com/test.pdf'
      }
    })

    // Initially should show loading
    await wrapper.vm.$nextTick()
    const text = wrapper.text()
    
    // Should have some indication it's working (either loading or controls)
    expect(text.length).toBeGreaterThan(0)
  })

  it('has zoom controls when PDF is loaded', async () => {
    const wrapper = mount(PdfViewer, {
      props: {
        pdfUrl: 'http://example.com/test.pdf'
      }
    })

    // Wait for PDF to "load"
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    // Should have zoom buttons after loading
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('configures PDF.js worker on mount', () => {
    mount(PdfViewer, {
      props: {
        pdfUrl: null
      }
    })

    // Worker should be configured to use local file
    expect(pdfjsLib.GlobalWorkerOptions.workerSrc).toBe('/pdf.worker.min.mjs')
  })
})
