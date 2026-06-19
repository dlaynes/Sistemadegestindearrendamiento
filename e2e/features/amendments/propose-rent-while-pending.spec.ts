import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: Contract amendments - propose blocking', () => {
  test('Scenario: Proposing a new rent change is blocked while a previous amendment is pending', async ({
    page,
  }) => {
    // Given I am logged in as a landlord with a pending amendment on contract 1.
    // We override the GET mock for amendments so the timeline shows one
    // pending amendment from the moment the page loads.
    await loginAs(page, 'arrendador')

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
              proposedByUserId: 3, // different from logged-in landlord
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
    await expect(page.getByText(/Pendiente: arrendador/i)).toBeVisible({ timeout: 10000 })

    // When I open the propose-amendment dialog
    const historySection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Historial de enmiendas' }),
    })
    await historySection.getByRole('button', { name: 'Proponer cambio' }).click()

    // Then the dialog shows a warning that a pending amendment already exists.
    // The warning is rendered with role="alert" so it is announced.
    const warning = page.getByRole('alert').filter({ hasText: /Ya existe una enmienda pendiente/i })
    await expect(warning).toBeVisible()

    // Fill in a value so we are not blocked by the empty-form guard.
    await page.getByLabel('Renta mensual').fill('1800')

    // And the submit button is disabled
    const submit = page.getByRole('dialog').getByRole('button', { name: /^Proponer$/ })
    await expect(submit).toBeDisabled()
  })
})
