import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiDocumentService } from '@/app/services/document.service'

const service = new ApiDocumentService()

describe('DocumentService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('uploadDocument returns document item', async () => {
    const file = new File(['content'], 'contract.pdf', { type: 'application/pdf' })
    const doc = await service.uploadDocument('CONTRACT', 1, file)
    expect(doc.id).toBe(1)
    expect(doc.name).toBe('contract.pdf')
    expect(doc.contentType).toBe('application/pdf')
  })

  it('getDocuments returns list', async () => {
    const docs = await service.getDocuments('CONTRACT', 1)
    expect(docs).toHaveLength(1)
    expect(docs[0].name).toBe('contract.pdf')
  })

  it('downloadDocument creates anchor and clicks', async () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => document.createElement("div"))
    const clickSpy = vi.fn()
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLAnchorElement)
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.createElement("div"))
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => document.createElement("div"))

    await service.downloadDocument(1)

    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    expect(revokeObjectURLSpy).toHaveBeenCalled()

    createObjectURLSpy.mockRestore()
    revokeObjectURLSpy.mockRestore()
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('deleteDocument does not throw', async () => {
    await expect(service.deleteDocument(1)).resolves.not.toThrow()
  })
})
