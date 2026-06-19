import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: Payment listing - empty state', () => {
  test('Scenario: Landlord with no payments sees the empty state', async ({ page }) => {
    // Given I am logged in as a landlord with no payments.
    await loginAs(page, 'arrendador')

    // Override the payments GET to return an empty array.
    await page.unroute('**/api/landlord/payments').catch(() => {})
    await page.route('**/api/landlord/payments', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })
    // Dashboard stats also pulls payments, so keep it consistent.
    await page.unroute('**/api/landlord/payments/*').catch(() => {})
    await page.route('**/api/landlord/payments/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    // When I navigate to the payments section
    await page.goto('/arrendador/pagos')

    // Then I see the payments page URL
    await expect(page).toHaveURL('/arrendador/pagos')

    // And I see the empty-state message
    await expect(page.getByText(/No hay pagos con el filtro actual/i)).toBeVisible()
  })
})
