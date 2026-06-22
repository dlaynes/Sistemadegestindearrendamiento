import { describe, it, expect, beforeEach } from 'vitest'
import { ApiPropertyService } from '@/app/services/property.service'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

const service = new ApiPropertyService()

function setRole(role: string) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ role, id: 1 }))
}

describe('PropertyService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getAll returns properties for landlord', async () => {
    setRole('arrendador')
    const properties = await service.getAll()
    expect(properties).toHaveLength(1)
    expect(properties[0].name).toBe('Cozy Apartment')
  })

  it('getAll returns properties for admin', async () => {
    setRole('administrador')
    const properties = await service.getAll()
    expect(properties).toHaveLength(1)
  })

  it('getById returns property', async () => {
    setRole('arrendador')
    const property = await service.getById(1)
    expect(property).toBeDefined()
    expect(property?.id).toBe(1)
  })

  it('getById returns undefined on 404', async () => {
    setRole('arrendador')
    server.use(
      http.get('**/api/landlord/properties/:id', () => {
        return new HttpResponse(null, { status: 404 })
      })
    )
    const property = await service.getById(999)
    expect(property).toBeUndefined()
  })

  it('getAvailable filters to disponible', async () => {
    setRole('arrendador')
    const available = await service.getAvailable()
    expect(available.every((p) => p.status === 'disponible')).toBe(true)
  })

  it('create returns created property', async () => {
    setRole('arrendador')
    const property = await service.create({
      id: 2,
      name: 'New House',
      address: '456 Oak St',
      type: 'casa',
      bedrooms: 3,
      bathrooms: 2,
      area: '120',
      rent: '2000',
      status: 'disponible',
      description: 'Nice house',
      yearBuilt: 2021,
      floors: 2,
      furnished: false,
      amenities: [],
    })
    expect(property.name).toBe('Cozy Apartment')
  })

  it('update returns updated property', async () => {
    setRole('arrendador')
    const property = await service.update(1, {
      id: 1,
      name: 'Updated',
      address: '123 Main St',
      type: 'apartamento',
      bedrooms: 2,
      bathrooms: 1,
      area: '80',
      rent: '1500',
      status: 'disponible',
      description: 'Nice apartment',
      yearBuilt: 2020,
      floors: 1,
      furnished: true,
      amenities: ['wifi'],
    })
    expect(property).toBeDefined()
  })

  it('delete does not throw', async () => {
    setRole('arrendador')
    await expect(service.delete(1)).resolves.not.toThrow()
  })
})
