import { test, expect, loginAs } from './features/_shared/fixtures'

test.describe('Navigation', () => {
  test('landlord can navigate from dashboard to properties', async ({ page }) => {
    await loginAs(page, 'arrendador')
    // The sidebar link is rendered twice (mobile + desktop); use role+name
    // so we don't have to worry about the visibility of either sidebar.
    await page.getByRole('link', { name: 'Propiedades' }).first().click()
    await expect(page).toHaveURL('/arrendador/propiedades')
    await expect(page.getByRole('heading', { name: 'Cozy Apartment' })).toBeVisible()
  })

  test('landlord can navigate from dashboard to contracts', async ({ page }) => {
    await loginAs(page, 'arrendador')
    await page.getByRole('link', { name: 'Contratos' }).first().click()
    await expect(page).toHaveURL('/arrendador/contratos')
    await expect(page.getByRole('heading', { name: 'CNT-001' })).toBeVisible()
  })

  test('landlord can navigate from dashboard to payments', async ({ page }) => {
    await loginAs(page, 'arrendador')
    await page.getByRole('link', { name: 'Pagos' }).first().click()
    await expect(page).toHaveURL('/arrendador/pagos')
    await expect(page.getByText('$1,500').first()).toBeVisible()
  })

  test('admin can navigate to users page', async ({ page }) => {
    await loginAs(page, 'administrador')
    await page.getByRole('link', { name: 'Usuarios' }).first().click()
    await expect(page).toHaveURL('/administrador/usuarios')
    await expect(page.getByRole('cell', { name: 'Admin User' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Landlord User' })).toBeVisible()
  })
})
