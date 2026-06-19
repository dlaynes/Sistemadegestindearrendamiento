import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: Contract listing', () => {
  test('Scenario: Landlord lists contracts', async ({ page }) => {
    // Given I am logged in as a landlord
    await loginAs(page, 'arrendador')

    // When I navigate to the contracts section
    await page.getByRole('link', { name: 'Contratos' }).click()

    // Then I see the contracts page URL
    await expect(page).toHaveURL('/arrendador/contratos')

    // And I can see the contract record returned by the API.
    // The contract code is rendered inside an <h3> inside the ContractCard.
    await expect(page.getByRole('heading', { name: 'CNT-001' })).toBeVisible()
  })
})
