import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: Payment listing', () => {
  test('Scenario: Landlord lists payments', async ({ page }) => {
    // Given I am logged in as a landlord
    await loginAs(page, 'arrendador')

    // When I navigate to the payments section
    await page.getByRole('link', { name: 'Pagos' }).click()

    // Then I see the payments page URL
    await expect(page).toHaveURL('/arrendador/pagos')

    // And I can see the payment amount returned by the API.
    // The payments page renders "$1,500" (toLocaleString) rather than the raw "1500".
    await expect(page.getByText('$1,500').first()).toBeVisible()
  })
})
