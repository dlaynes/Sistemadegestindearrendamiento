import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiReportService } from '@/app/services/report.service'

const service = new ApiReportService()

describe('ReportService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('getSummary returns counts', async () => {
    const summary = await service.getSummary()
    expect(summary.properties).toBe(5)
    expect(summary.contracts).toBe(3)
    expect(summary.payments).toBe(10)
    expect(summary.users).toBe(4)
  })

  it('downloadReport triggers download', async () => {
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

    await service.downloadReport('properties')

    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()

    createObjectURLSpy.mockRestore()
    revokeObjectURLSpy.mockRestore()
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })
})
