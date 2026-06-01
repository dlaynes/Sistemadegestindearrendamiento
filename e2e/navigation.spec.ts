import { test, expect, loginAs } from './fixtures'

test.describe('Navigation', () => {
  test('landlord can navigate from dashboard to properties', async ({ page }) => {
    await loginAs(page, 'arrendador')
    await page.click('text=Propiedades')
    await expect(page).toHaveURL('/arrendador/propiedades')
    await expect(page.getByText('Cozy Apartment')).toBeVisible()
  })

  test('landlord can navigate from dashboard to contracts', async ({ page }) => {
    await loginAs(page, 'arrendador')
    await page.click('text=Contratos')
    await expect(page).toHaveURL('/arrendador/contratos')
    await expect(page.getByText('CNT-001')).toBeVisible()
  })

  test('landlord can navigate from dashboard to payments', async ({ page }) => {
    await loginAs(page, 'arrendador')
    await page.click('text=Pagos')
    await expect(page).toHaveURL('/arrendador/pagos')
    await expect(page.getByText('1500')).toBeVisible()
  })

  test('admin can navigate to users page', async ({ page }) => {
    await loginAs(page, 'administrador')
    await page.click('text=Usuarios')
    await expect(page).toHaveURL('/administrador/usuarios')
    await expect(page.getByText('Admin User')).toBeVisible()
    await expect(page.getByText('Landlord User')).toBeVisible()
  })
})
