import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: Authentication', () => {
  test('Scenario: Successful login for a landlord', async ({ page }) => {
    // Given I am on the login page
    // When I enter valid landlord credentials and submit the login form
    await loginAs(page, 'arrendador')

    // Then I am redirected to the landlord dashboard
    await expect(page).toHaveURL('/arrendador/dashboard')

    // And I can see the landlord user identity in the sidebar.
    // The name appears in both the mobile sidebar and the desktop sidebar
    // (the Layout renders both <aside> elements at every viewport). Scope
    // to the desktop <aside> which is the visible one in headless Chromium.
    await expect(
      page.getByRole('complementary').getByText('Landlord User'),
    ).toBeVisible()
  })
})
