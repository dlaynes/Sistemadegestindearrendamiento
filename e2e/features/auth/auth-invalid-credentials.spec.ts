import { test, expect } from '../_shared/fixtures'

test.describe('Feature: Authentication - error handling', () => {
  test('Scenario: Login fails with an error banner when credentials are invalid', async ({ page }) => {
    // Override the login endpoint so it returns 401 regardless of input.
    // This is the production behaviour for unknown email / wrong password.
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 401, body: 'Unauthorized' })
    })

    // Given I am on the login page
    await page.goto('/login')

    // When I enter an unknown email and a password
    await page.fill('input[type="email"]', 'nobody@example.com')
    await page.fill('input[type="password"]', 'wrong-password')

    // And I submit the login form
    await page.click('button[type="submit"]')

    // Then I see an inline error banner saying the credentials are invalid
    // The error banner is the role="alert" region inside the login form.
    const errorBanner = page.getByRole('alert')
    await expect(errorBanner).toBeVisible()
    await expect(errorBanner).toContainText(/Credenciales inválidas/i)

    // And I remain on the login page (no redirect to a dashboard).
    await expect(page).toHaveURL(/\/login$/)
  })
})
