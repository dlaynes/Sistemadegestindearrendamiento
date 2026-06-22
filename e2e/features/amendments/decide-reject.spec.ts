import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: Contract amendments - rejection', () => {
  test('Scenario: Landlord rejects a pending rent amendment with a reason', async ({ page }) => {
    // Given I am logged in as a landlord with a pending rent amendment.
    await loginAs(page, 'arrendador')

    await page.unroute('**/api/landlord/contracts/*/amendments').catch(() => {})
    let proposedAmendment = {
      id: 50,
      contractId: 1,
      proposedByUserId: 3, // different from logged-in landlord → canDecide === true
      proposedByRole: 'inquilino' as const,
      status: 'pending_landlord' as const,
      proposedChanges: { monthlyRent: '1700' },
      reason: 'Ajuste anual',
      createdAt: new Date().toISOString(),
      decidedAt: null,
      decidedByUserId: null,
      deciderRole: null,
      decisionNote: null,
      expiresAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
    }
    // Mock the amendments list (GET) — seed with a pending rent amendment from
    // the tenant, so the landlord (logged in) is the counterparty and can decide.
    await page.route('**/api/landlord/contracts/*/amendments', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([proposedAmendment]),
        })
        return
      }
      await route.fallback()
    })

    // Mock the decision endpoint specifically (POST .../amendments/:id/decision).
    // Mutate BEFORE fulfilling so any GET fired immediately after the POST
    // (react-query invalidates + refetches) sees the updated state.
    await page.route('**/api/landlord/contracts/*/amendments/*/decision', async (route) => {
      if (route.request().method() === 'POST') {
        const body = JSON.parse(route.request().postData() || '{}')
        const decidedStatus = body.decision === 'APPROVED' ? 'approved' : 'rejected'
        proposedAmendment = {
          ...proposedAmendment,
          status: decidedStatus as any,
          decidedAt: new Date().toISOString(),
          decidedByUserId: 2,
          deciderRole: 'arrendador',
          decisionNote: body.decisionNote ?? null,
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(proposedAmendment),
        })
        return
      }
      await route.fallback()
    })

    await page.goto('/arrendador/contratos/1')
    await expect(page.getByText(/Pendiente: arrendador/i)).toBeVisible({ timeout: 10000 })

    // When I open the reject-amendment dialog
    const historySection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Historial de enmiendas' }),
    })
    await historySection.getByRole('button', { name: /^Rechazar$/ }).click()

    // And I type a rejection reason
    await page.getByLabel(/Nota/i).fill('No podemos subir la renta en este momento.')

    // And I submit the rejection
    // Wait for the decision dialog to close (proves the mutation resolved and
    // react-query invalidated the amendments query); then check the timeline.
    await page.getByRole('dialog').getByRole('button', { name: /^Rechazar$/ }).click()
    await expect(page.getByText(/Rechazar cambio/i)).not.toBeVisible({ timeout: 10000 })

    // Then the amendment is shown as rejected.
    // Scoped to historySection so we don't accidentally match the same word elsewhere.
    await expect(historySection.getByText(/Rechazado/i).first()).toBeVisible({ timeout: 10000 })
  })
})
