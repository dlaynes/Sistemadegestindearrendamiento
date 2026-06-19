import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: Property listing', () => {
  test('Scenario: Landlord lists properties', async ({ page }) => {
    // Given I am logged in as a landlord
    await loginAs(page, 'arrendador')

    // When I navigate to the properties section
    await page.getByRole('link', { name: 'Propiedades' }).click()

    // Then I see the properties page URL
    await expect(page).toHaveURL('/arrendador/propiedades')

    // And I can see the properties returned by the API
    await expect(page.getByRole('heading', { name: 'Cozy Apartment' })).toBeVisible()
  })
})
