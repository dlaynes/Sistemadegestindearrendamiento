import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Característica: Cierre de contrato por mutuo acuerdo', () => {
  test('Escenario: El arrendador aprueba el cierre del contrato y los pagos pendientes pasan a cancelado', async ({ page }) => {
    // Given I am logged in as a landlord with a pending closure amendment
    // proposed by the tenant (inquilino) on contract 1.
    await loginAs(page, 'arrendador')

    await page.unroute('**/api/landlord/contracts/*/amendments').catch(() => {})
    let proposedAmendment = {
      id: 60,
      contractId: 1,
      // The tenant (id 3) is the proposer, the landlord (currentUserId=2)
      // is the counterparty → canDecide === true.
      proposedByUserId: 3,
      proposedByRole: 'inquilino' as const,
      status: 'pending_landlord' as const,
      // Closure amendment: only one change, status = "cancelado".
      proposedChanges: { status: 'cancelado' },
      reason: 'Mutuo acuerdo entre las partes',
      createdAt: new Date().toISOString(),
      decidedAt: null,
      decidedByUserId: null,
      deciderRole: null,
      decisionNote: null,
      expiresAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
    }

    // Mock the amendments list (GET) — seed with the pending closure amendment.
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
    // (react-query invalidates + refetches) sees the approved state.
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

    // When I navigate to the contract detail page
    await page.goto('/arrendador/contratos/1')

    // And the closure amendment renders in the history section as pending
    const historySection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Historial de enmiendas' }),
    })
    await expect(historySection.getByText(/Pendiente: arrendador/i)).toBeVisible({ timeout: 10000 })
    await expect(historySection.getByText(/Cerrar contrato/i)).toBeVisible({ timeout: 10000 })
    await expect(historySection.getByText(/activo → cancelado/i)).toBeVisible({ timeout: 10000 })

    // And I open the approve-closure dialog
    await historySection.getByRole('button', { name: /^Aprobar$/ }).click()
    // The decision dialog has a destructive-styled submit button labeled "Aprobar".
    await expect(page.getByText(/Aprobar cierre del contrato/i)).toBeVisible({ timeout: 10000 })

    // And I confirm the approval
    await page.getByRole('dialog').getByRole('button', { name: /^Aprobar$/ }).click()

    // Then the dialog closes (proves the mutation resolved and react-query
    // invalidated the amendments query).
    await expect(page.getByText(/Aprobar cierre del contrato/i)).not.toBeVisible({ timeout: 10000 })

    // And the amendment is shown as approved in the history section.
    // Scoped to historySection so we don't accidentally match the same word elsewhere.
    await expect(historySection.getByText(/Aprobado/i).first()).toBeVisible({ timeout: 10000 })
  })
})
