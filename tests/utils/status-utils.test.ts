import { describe, it, expect } from 'vitest'
import {
  getContractStatusColor,
  getContractStatusLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  getPropertyStatusColor,
  getPropertyStatusLabel,
  getUserStatusColor,
  getUserStatusLabel,
  isActiveStatus,
  isWarningStatus,
} from '@/app/components/shared/utils/status-utils'

describe('status-utils', () => {
  describe('contract status', () => {
    it.each([
      ['activo', 'Activo', 'bg-success-muted'],
      ['proximo_vencer', 'Próximo a Vencer', 'bg-warning-muted'],
      ['vencido', 'Vencido', 'bg-destructive-muted'],
      ['cancelado', 'Cancelado', 'bg-muted'],
      ['terminado', 'Terminado', 'bg-primary-muted'],
    ] as const)('maps %s to label %s and color %s', (status, label, color) => {
      expect(getContractStatusLabel(status)).toBe(label)
      expect(getContractStatusColor(status)).toContain(color)
    })
  })

  describe('payment status', () => {
    it.each([
      ['pagado', 'Pagado', 'bg-success-muted'],
      ['pendiente', 'Pendiente', 'bg-warning-muted'],
      ['vencido', 'Vencido', 'bg-destructive-muted'],
      ['procesando', 'Procesando', 'bg-primary-muted'],
    ] as const)('maps %s to label %s and color %s', (status, label, color) => {
      expect(getPaymentStatusLabel(status)).toBe(label)
      expect(getPaymentStatusColor(status)).toContain(color)
    })
  })

  describe('property status', () => {
    it.each([
      ['disponible', 'Disponible', 'bg-primary-muted'],
      ['ocupado', 'Ocupado', 'bg-success-muted'],
      ['mantenimiento', 'En Mantenimiento', 'bg-warning-muted'],
    ] as const)('maps %s to label %s and color %s', (status, label, color) => {
      expect(getPropertyStatusLabel(status)).toBe(label)
      expect(getPropertyStatusColor(status)).toContain(color)
    })
  })

  describe('user status', () => {
    it.each([
      ['activo', 'Activo', 'bg-success-muted'],
      ['inactivo', 'Inactivo', 'bg-muted'],
    ] as const)('maps %s to label %s and color %s', (status, label, color) => {
      expect(getUserStatusLabel(status)).toBe(label)
      expect(getUserStatusColor(status)).toContain(color)
    })
  })

  describe('isActiveStatus', () => {
    it('returns true for active statuses', () => {
      expect(isActiveStatus('activo')).toBe(true)
      expect(isActiveStatus('pagado')).toBe(true)
      expect(isActiveStatus('ocupado')).toBe(true)
    })

    it('returns false for non-active statuses', () => {
      expect(isActiveStatus('pendiente')).toBe(false)
      expect(isActiveStatus('cancelado')).toBe(false)
    })
  })

  describe('isWarningStatus', () => {
    it('returns true for warning statuses', () => {
      expect(isWarningStatus('pendiente')).toBe(true)
      expect(isWarningStatus('proximo_vencer')).toBe(true)
      expect(isWarningStatus('vencido')).toBe(true)
    })

    it('returns false for non-warning statuses', () => {
      expect(isWarningStatus('activo')).toBe(false)
      expect(isWarningStatus('pagado')).toBe(false)
    })
  })
})
