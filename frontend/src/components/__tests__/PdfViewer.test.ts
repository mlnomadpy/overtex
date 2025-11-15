import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PdfViewer from '../PdfViewer.vue'

// Mock @vue-pdf-viewer/viewer
vi.mock('@vue-pdf-viewer/viewer', () => ({
  VPdfViewer: {
    name: 'VPdfViewer',
    props: ['src'],
    template: '<div class="mock-pdf-viewer" data-testid="pdf-viewer"></div>'
  }
}))

describe('PdfViewer', () => {
  it('renders without crashing', () => {
    const wrapper = mount(PdfViewer, {
      props: {
        pdfUrl: null
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "No PDF loaded" when pdfUrl is null', () => {
    const wrapper = mount(PdfViewer, {
      props: {
        pdfUrl: null
      }
    })
    expect(wrapper.text()).toContain('No PDF Loaded')
  })

  it('renders VPdfViewer when pdfUrl is provided', () => {
    const wrapper = mount(PdfViewer, {
      props: {
        pdfUrl: '/api/pdf'
      }
    })
    const pdfViewer = wrapper.find('[data-testid="pdf-viewer"]')
    expect(pdfViewer.exists()).toBe(true)
  })

  it('exposes reload method', () => {
    const wrapper = mount(PdfViewer, {
      props: {
        pdfUrl: '/api/pdf'
      }
    })
    expect(wrapper.vm.reload).toBeDefined()
    expect(typeof wrapper.vm.reload).toBe('function')
  })
})
