import { test, expect, loginAs } from '../_shared/fixtures'

const mockProperty = {
  id: 1,
  name: 'Cozy Apartment',
  address: '123 Main St',
}

const mockTenant = {
  id: 3,
  name: 'Tenant User',
  email: 'tenant@test.com',
  role: 'inquilino',
  status: 'activo',
}

test.describe('Caracteristica: Wizard de contratos - seleccion de inquilino', () => {
  async function fillTermsStep(page: import('@playwright/test').Page) {
    await expect(page.getByText('Paso 3 de 6: Términos')).toBeVisible()
    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.nth(0).fill('2026-08-01')
    await dateInputs.nth(1).fill('2027-07-31')
    // Renta mensual and deposit are the second and fourth spinbuttons
    const numberInputs = page.locator('input[type="number"]')
    await numberInputs.nth(1).fill('1500')
    await numberInputs.nth(3).fill('3000')
  }

  async function submitContract(page: import('@playwright/test').Page, createdPayloadRef: { value: Record<string, unknown> | null }) {
    await page.getByRole('button', { name: /^Siguiente$/ }).click()
    await expect(page.getByText(/Paso 4 de 6/)).toBeVisible({ timeout: 10000 })
    await page.getByRole('button', { name: /^Siguiente$/ }).click()
    await expect(page.getByText(/Paso 5 de 6/)).toBeVisible({ timeout: 10000 })
    await page.getByRole('button', { name: /^Siguiente$/ }).click()
    await expect(page.getByText('Paso 6 de 6: Revisión')).toBeVisible({ timeout: 10000 })
    await page.getByRole('button', { name: /Crear Contrato/ }).click()
    await expect(page).toHaveURL('/arrendador/contratos')
  }

  test('Escenario: Ingresar inquilino manualmente habilita el boton Continuar y envia datos de invitacion', async ({ page }) => {
    const createdPayloadRef: { value: Record<string, unknown> | null } = { value: null }
    await loginAs(page, 'arrendador')

    await page.route('**/api/landlord/contracts', async (route) => {
      if (route.request().method() === 'POST') {
        createdPayloadRef.value = JSON.parse(route.request().postData() || '{}')
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 99,
            code: 'CT-9999',
            propertyId: mockProperty.id,
            tenantId: createdPayloadRef.value?.tenantId ?? null,
            invitedTenantName: createdPayloadRef.value?.invitedTenantName,
            invitedTenantEmail: createdPayloadRef.value?.invitedTenantEmail,
            invitedTenantPhone: createdPayloadRef.value?.invitedTenantPhone,
            status: 'activo',
          }),
        })
        return
      }
      await route.fallback()
    })

    await page.goto('/arrendador/contratos/nuevo')
    await expect(page.getByText('Paso 1 de 6: Propiedad')).toBeVisible()

    await page.fill('input[placeholder*="Buscar propiedad"]', 'Cozy')
    await page.getByRole('button', { name: /Cozy Apartment/ }).click()
    await expect(page.getByText(/Cozy Apartment/)).toBeVisible()
    await page.getByRole('button', { name: /^Siguiente$/ }).click()

    await expect(page.getByText('Paso 2 de 6: Inquilino')).toBeVisible()
    await page.fill('input[placeholder*="Buscar inquilino"]', 'Nuevo Inquilino')
    await page.fill('input[type="email"]', 'nuevo@test.com')
    await page.fill('input[type="tel"]', '+1234567890')
    await expect(page.getByRole('button', { name: /^Siguiente$/ })).toBeEnabled()

    await page.getByRole('button', { name: /^Siguiente$/ }).click()
    await fillTermsStep(page)
    await submitContract(page, createdPayloadRef)

    expect(createdPayloadRef.value).not.toBeNull()
    expect(createdPayloadRef.value?.tenantId).toBeFalsy()
    expect(createdPayloadRef.value?.invitedTenantName).toBe('Nuevo Inquilino')
    expect(createdPayloadRef.value?.invitedTenantEmail).toBe('nuevo@test.com')
    expect(createdPayloadRef.value?.invitedTenantPhone).toBe('+1234567890')
  })

  test('Escenario: Seleccionar un inquilino existente deshabilita los campos y envia tenantId', async ({ page }) => {
    const createdPayloadRef: { value: Record<string, unknown> | null } = { value: null }
    await loginAs(page, 'arrendador')

    await page.route('**/api/landlord/contracts', async (route) => {
      if (route.request().method() === 'POST') {
        createdPayloadRef.value = JSON.parse(route.request().postData() || '{}')
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 99,
            code: 'CT-9999',
            propertyId: mockProperty.id,
            tenantId: createdPayloadRef.value?.tenantId,
            status: 'activo',
          }),
        })
        return
      }
      await route.fallback()
    })

    await page.goto('/arrendador/contratos/nuevo')
    await page.fill('input[placeholder*="Buscar propiedad"]', 'Cozy')
    await page.getByRole('button', { name: /Cozy Apartment/ }).click()
    await page.getByRole('button', { name: /^Siguiente$/ }).click()

    await expect(page.getByText('Paso 2 de 6: Inquilino')).toBeVisible()
    await page.fill('input[placeholder*="Buscar inquilino"]', 'Tenant')
    await page.getByRole('button', { name: /Tenant User/ }).click()

    await expect(page.locator('input[type="email"]')).toBeDisabled()
    await expect(page.locator('input[type="tel"]')).toBeDisabled()
    await expect(page.getByRole('button', { name: /^Siguiente$/ })).toBeEnabled()

    await page.getByRole('button', { name: /^Siguiente$/ }).click()
    await fillTermsStep(page)
    await submitContract(page, createdPayloadRef)

    expect(createdPayloadRef.value).not.toBeNull()
    expect(createdPayloadRef.value?.tenantId).toBe(mockTenant.id)
    expect(createdPayloadRef.value?.invitedTenantEmail).toBe('tenant@test.com')
  })

  test('Escenario: Cambiar inquilino limpia la seleccion y permite ingreso manual', async ({ page }) => {
    const createdPayloadRef: { value: Record<string, unknown> | null } = { value: null }
    await loginAs(page, 'arrendador')

    await page.route('**/api/landlord/contracts', async (route) => {
      if (route.request().method() === 'POST') {
        createdPayloadRef.value = JSON.parse(route.request().postData() || '{}')
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 99,
            code: 'CT-9999',
            propertyId: mockProperty.id,
            tenantId: createdPayloadRef.value?.tenantId ?? null,
            invitedTenantName: createdPayloadRef.value?.invitedTenantName,
            invitedTenantEmail: createdPayloadRef.value?.invitedTenantEmail,
            status: 'activo',
          }),
        })
        return
      }
      await route.fallback()
    })

    await page.goto('/arrendador/contratos/nuevo')
    await page.fill('input[placeholder*="Buscar propiedad"]', 'Cozy')
    await page.getByRole('button', { name: /Cozy Apartment/ }).click()
    await page.getByRole('button', { name: /^Siguiente$/ }).click()

    await page.fill('input[placeholder*="Buscar inquilino"]', 'Tenant')
    await page.getByRole('button', { name: /Tenant User/ }).click()
    await expect(page.locator('input[type="email"]')).toBeDisabled()

    await page.getByRole('button', { name: /Cambiar inquilino/ }).click()
    await expect(page.locator('input[type="email"]')).toBeEnabled()
    await expect(page.locator('input[type="tel"]')).toBeEnabled()

    await page.fill('input[placeholder*="Buscar inquilino"]', 'Otro Inquilino')
    await page.fill('input[type="email"]', 'otro@test.com')
    await page.fill('input[type="tel"]', '+9876543210')
    await expect(page.getByRole('button', { name: /^Siguiente$/ })).toBeEnabled()

    await page.getByRole('button', { name: /^Siguiente$/ }).click()
    await fillTermsStep(page)
    await submitContract(page, createdPayloadRef)

    expect(createdPayloadRef.value).not.toBeNull()
    expect(createdPayloadRef.value?.tenantId).toBeFalsy()
    expect(createdPayloadRef.value?.invitedTenantEmail).toBe('otro@test.com')
  })
})