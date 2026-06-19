import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: Contract amendments - withdraw', () => {
  test('Scenario: Proposer withdraws their own pending amendment', async ({ page }) => {
    // Given I am logged in as a landlord who has proposed a pending amendment.
    // proposedByUserId === 2 (the logged-in landlord) so the card shows the
    // "Retirar propuesta" button (isProposer === true).
    await loginAs(page, 'arrendador')

    await page.unroute('**/api/landlord/contracts/*/amendments').catch(() => {})
    let proposedAmendment = {
      id: 60,
      contractId: 1,
      proposedByUserId: 2, // same as the logged-in landlord (mockUsers.arrendador.id)
      proposedByRole: 'arrendador' as const,
      status: 'pending_tenant' as const, // tenant must decide; landlord is proposer
      proposedChanges: { monthlyRent: '1700' },
      reason: 'Ajuste anual',
      createdAt: new Date().toISOString(),
      decidedAt: null,
      decidedByUserId: null,
      deciderRole: null,
      decisionNote: null,
      expiresAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
    }
    // Mock the amendments list (GET) — seed with the proposer's pending amendment.
    // Pattern matches the bare amendments URL (no trailing path).
    await page.route('**/api/landlord/contracts/*/amendments', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([proposedAmendment]),
        })
        return
      }
      // Any other method on this URL — let it through.
      await route.fallback()
    })

    // Mock the withdraw endpoint specifically (POST .../amendments/:id/withdraw).
    // Mutate BEFORE fulfilling so any GET fired immediately after the POST
    // (react-query invalidates + refetches) sees the updated state.
    await page.route('**/api/landlord/contracts/*/amendments/*/withdraw', async (route) => {
      if (route.request().method() === 'POST') {
        proposedAmendment = {
          ...proposedAmendment,
          status: 'withdrawn' as const,
          decidedAt: new Date().toISOString(),
          decidedByUserId: 2,
          deciderRole: 'arrendador',
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
    await expect(page.getByText(/Pendiente: inquilino/i)).toBeVisible({ timeout: 10000 })

    // Then I see a "Retirar propuesta" button on my own pending card.
    const historySection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Historial de enmiendas' }),
    })
    await expect(historySection.getByText(/Pendiente: inquilino/i)).toBeVisible({ timeout: 10000 })
    const withdrawBtn = historySection.getByRole('button', { name: /Retirar propuesta/i })
    await expect(withdrawBtn).toBeVisible()

    await withdrawBtn.click()
    const confirmDialog = page.getByRole('alertdialog')
    await expect(confirmDialog.getByText(/¿Retirar la propuesta\?/i)).toBeVisible({ timeout: 5000 })
    // The dialog's action button reads exactly 'Retirar' (with disabled='Retirando…'
    // while submitting). Wait until the button is enabled, then click. Match by role
    // + exact name to avoid matching the in-card 'Retirar propuesta' button if it
    // ever appears inside the dialog (it does not today, but be defensive).
    const confirmBtn = confirmDialog.getByRole('button', { name: 'Retirar', exact: true })
    await expect(confirmBtn).toBeEnabled()
    await confirmBtn.click()

    // Then the amendment is shown as withdrawn.
    // Wait for the confirm dialog to close (proves the mutation resolved and
    // react-query invalidated the amendments query); then check the timeline.
    await expect(
      page.getByRole('alertdialog').getByText(/¿Retirar la propuesta\?/i),
    ).not.toBeVisible({ timeout: 10000 })
    await expect(historySection.getByText(/Retirado/i).first()).toBeVisible({ timeout: 10000 })
  })
})
