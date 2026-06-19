import { test, expect, loginAs } from './features/_shared/fixtures'

test.describe('Dashboard', () => {
  test('admin dashboard renders stats cards', async ({ page }) => {
    await loginAs(page, 'administrador')
    await expect(page.getByText('Total Propiedades')).toBeVisible()
    await expect(page.getByText('Total Contratos')).toBeVisible()
    await expect(page.getByText('Total Usuarios')).toBeVisible()
  })

  test('landlord dashboard renders properties and contracts', async ({ page }) => {
    await loginAs(page, 'arrendador')
    await expect(page.getByText('Mis Propiedades')).toBeVisible()
    await expect(page.getByText('Contratos Activos')).toBeVisible()
  })

  test('tenant dashboard renders payments', async ({ page }) => {
    await loginAs(page, 'inquilino')
    await expect(page.getByRole('heading', { name: 'Historial de Pagos' })).toBeVisible()
  })
})
