import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: User management', () => {
  test('Scenario: Admin lists users', async ({ page }) => {
    // Given I am logged in as an administrator
    await loginAs(page, 'administrador')

    // When I navigate to the users section
    await page.getByRole('link', { name: 'Usuarios' }).click()

    // Then I see the users page URL
    await expect(page).toHaveURL('/administrador/usuarios')

    // And I can see the admin user record (in the users table)
    await expect(page.getByRole('cell', { name: 'Admin User' })).toBeVisible()

    // And I can see the landlord user record (in the users table)
    await expect(page.getByRole('cell', { name: 'Landlord User' })).toBeVisible()
  })
})
