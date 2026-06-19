import { test, expect } from '../_shared/fixtures'

test.describe('Feature: Authentication - protected route redirect', () => {
  test('Scenario: Unauthenticated access to a landlord route redirects to login', async ({ page }) => {
    // Given I have no active session (no rentmanager_user / token in storage).
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.removeItem('rentmanager_user')
      localStorage.removeItem('token')
    })

    // When I navigate directly to a landlord dashboard URL
    await page.goto('/arrendador/dashboard')

    // Then I am redirected to the login page (ProtectedRoute uses <Navigate to="/login" replace />).
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible()
  })
})
