import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: Contract amendments - reject validation', () => {
  test('Scenario: Rejecting an amendment with a note shorter than 3 characters is blocked', async ({ page }) => {
    // Given I am logged in as a landlord with a pending rent amendment.
    // The stateful mock in fixtures.ts seeds the amendment after a POST,
    // but for this scenario we want it visible on first load — so we
    // override the GET to return a single pending amendment directly.
    await loginAs(page, 'arrendador')

    // Open the contract detail and inject a pending amendment into the
    // timeline via the existing list-by-contract mock. We re-register
    // the GET so it returns the seeded amendment instead of [].
    await page.unroute('**/api/landlord/contracts/*/amendments').catch(() => {})
    await page.route('**/api/landlord/contracts/*/amendments', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 50,
              contractId: 1,
              // Different from the logged-in landlord (id 2) so the card
              // shows the Aprobar/Rechazar buttons (canDecide === true).
              proposedByUserId: 3,
              proposedByRole: 'inquilino',
              status: 'pending_landlord',
              proposedChanges: { monthlyRent: '1700' },
              reason: 'Ajuste anual',
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
            },
          ]),
        })
        return
      }
      await route.fallback()
    })

    await page.goto('/arrendador/contratos/1')

    // Wait for the timeline to render the seeded card.
    await expect(page.getByText(/Pendiente: arrendador/i)).toBeVisible({ timeout: 10000 })

    // When I open the reject-amendment dialog
    // The card has a "Rechazar" button next to "Aprobar".
    const historySection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Historial de enmiendas' }),
    })
    await historySection.getByRole('button', { name: /^Rechazar$/ }).click()

    // And I type a 1-character rejection note
    await page.getByLabel(/Nota/i).fill('x')

    // Then the submit button is disabled
    const submit = page.getByRole('dialog').getByRole('button', { name: /^Rechazar$/ })
    await expect(submit).toBeDisabled()

    // And the dialog shows the minimum-length hint
    await expect(page.getByText(/Mínimo 3 caracteres/i)).toBeVisible()
  })
})
