import { test, expect, loginAs } from './fixtures'

test.describe('Dashboard', () => {
  test('admin dashboard renders stats cards', async ({ page }) => {
    await loginAs(page, 'administrador')
    await expect(page.getByText('Total Properties')).toBeVisible()
    await expect(page.getByText('Total Contracts')).toBeVisible()
    await expect(page.getByText('Total Users')).toBeVisible()
  })

  test('landlord dashboard renders properties and contracts', async ({ page }) => {
    await loginAs(page, 'arrendador')
    await expect(page.getByText('Cozy Apartment')).toBeVisible()
    await expect(page.getByText('CNT-001')).toBeVisible()
  })

  test('tenant dashboard renders payments', async ({ page }) => {
    await loginAs(page, 'inquilino')
    await expect(page.getByText('1500')).toBeVisible()
  })
})
