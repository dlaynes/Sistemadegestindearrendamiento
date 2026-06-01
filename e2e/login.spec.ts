import { test, expect, loginAs } from './fixtures'

test.describe('Login Flow', () => {
  test('admin can log in and reach dashboard', async ({ page }) => {
    await loginAs(page, 'administrador')
    await expect(page).toHaveURL('/administrador/dashboard')
    await expect(page.getByText('Admin User')).toBeVisible()
  })

  test('landlord can log in and reach dashboard', async ({ page }) => {
    await loginAs(page, 'arrendador')
    await expect(page).toHaveURL('/arrendador/dashboard')
    await expect(page.getByText('Landlord User')).toBeVisible()
  })

  test('tenant can log in and reach dashboard', async ({ page }) => {
    await loginAs(page, 'inquilino')
    await expect(page).toHaveURL('/inquilino/dashboard')
    await expect(page.getByText('Tenant User')).toBeVisible()
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 401, body: 'Unauthorized' })
    })

    await page.goto('/login')
    await page.fill('input[type="email"]', 'bad@example.com')
    await page.fill('input[type="password"]', 'wrong')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/Credenciales inválidas/)).toBeVisible()
  })
})
