import { describe, it, expect } from 'vitest'
import {
  getDaysUntilExpiration,
  getDaysOverdue,
  formatDate,
  formatShortDate,
  formatTimeAgo,
} from '@/app/components/shared/utils/date-utils'

describe('date-utils', () => {
  describe('getDaysUntilExpiration', () => {
    it('calculates days until end date', () => {
      const from = new Date('2026-01-01')
      const days = getDaysUntilExpiration('2026-01-15', from)
      expect(days).toBe(14)
    })

    it('returns negative for past dates', () => {
      const from = new Date('2026-02-01')
      const days = getDaysUntilExpiration('2026-01-15', from)
      expect(days).toBeLessThan(0)
    })
  })

  describe('getDaysOverdue', () => {
    it('calculates days overdue', () => {
      const from = new Date('2026-02-10')
      const days = getDaysOverdue('2026-02-01', from)
      expect(days).toBe(9)
    })

    it('returns negative when not yet due', () => {
      const from = new Date('2026-01-01')
      const days = getDaysOverdue('2026-02-01', from)
      expect(days).toBeLessThan(0)
    })
  })

  describe('formatDate', () => {
    it('formats date in Spanish locale', () => {
      const formatted = formatDate('2026-05-15')
      expect(formatted).toContain('2026')
    })
  })

  describe('formatShortDate', () => {
    it('formats date in short format', () => {
      const formatted = formatShortDate('2026-05-15')
      expect(formatted).toContain('2026')
    })
  })

  describe('formatTimeAgo', () => {
    it('returns days for old dates', () => {
      const oldDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      expect(formatTimeAgo(oldDate)).toContain('3')
      expect(formatTimeAgo(oldDate)).toContain('día')
    })

    it('returns hours for recent dates', () => {
      const recentDate = new Date(Date.now() - 2 * 60 * 60 * 1000)
      expect(formatTimeAgo(recentDate)).toContain('2')
      expect(formatTimeAgo(recentDate)).toContain('hora')
    })

    it('returns minutes for very recent dates', () => {
      const veryRecent = new Date(Date.now() - 5 * 60 * 1000)
      expect(formatTimeAgo(veryRecent)).toContain('5')
      expect(formatTimeAgo(veryRecent)).toContain('minuto')
    })

    it('returns just now for current date', () => {
      const now = new Date()
      expect(formatTimeAgo(now)).toContain('momento')
    })
  })
})
