import { test, expect, loginAs } from '../_shared/fixtures'

/**
 * TC-NF-006 — Inyección de HTML en campos de texto libre
 *
 * React escapa por defecto; verificamos que un payload <script> en la nota
 * de rechazo de una enmienda se renderiza como texto literal y no ejecuta JS.
 *
 * Estrategia: registramos handlers stateful (mutan el mismo objeto
 * `proposedAmendment` que el GET lee) y luego simplemente verificamos
 * que la página renderiza el payload como texto escapado.
 */
test.describe('No funcional: Inyección de HTML / XSS', () => {
  test('Un payload <script> en la nota de rechazo se renderiza como texto literal', async ({ page }) => {
    // Track if the payload ever executes
    let xssFired = false
    await page.exposeFunction('__xssMarker', () => {
      xssFired = true
    })

    // Install a custom alert() that would mark XSS as fired (in case the
    // payload ever executes as inline script — it shouldn't).
    await page.addInitScript(() => {
      window.alert = () => {
        ;(window as any).__xssMarker?.()
      }
    })

    // Given I am logged in as a landlord with a pending rent amendment
    await loginAs(page, 'arrendador')
    await page.unroute('**/api/landlord/contracts/*/amendments').catch(() => {})
    await page.unroute('**/api/landlord/contracts/*/amendments/*/decision').catch(() => {})

    // Mutable state shared between GET and POST handlers (closures).
    const state: { amendment: Record<string, unknown> } = {
      amendment: {
        id: 80,
        contractId: 1,
        proposedByUserId: 3,
        proposedByRole: 'inquilino',
        status: 'pending_landlord',
        proposedChanges: { monthlyRent: '1700' },
        reason: 'Ajuste anual',
        createdAt: new Date().toISOString(),
        decidedAt: null,
        decidedByUserId: null,
        deciderRole: null,
        decisionNote: null,
        expiresAt: new Date(Date.now() + 14 * 86400_000).toISOString(),
      },
    }

    await page.route('**/api/landlord/contracts/*/amendments', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([state.amendment]),
        })
        return
      }
      await route.fallback()
    })

    await page.route('**/api/landlord/contracts/*/amendments/*/decision', async (route) => {
      if (route.request().method() === 'POST') {
        const body = JSON.parse(route.request().postData() || '{}')
        // Mutate the shared state in-place so the next GET sees the update.
        state.amendment = {
          ...state.amendment,
          status: 'rejected',
          decisionNote: body.decisionNote ?? null,
          decidedAt: new Date().toISOString(),
          decidedByUserId: 2,
          deciderRole: 'arrendador',
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(state.amendment),
        })
        return
      }
      await route.fallback()
    })

    await page.goto('/arrendador/contratos/1')
    await expect(page.getByText(/Pendiente: arrendador/i)).toBeVisible({ timeout: 10000 })

    // When I open the reject dialog and type a script payload
    const historySection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Historial de enmiendas' }),
    })
    await historySection.getByRole('button', { name: /^Rechazar$/ }).click()
    const payload = '<script>window.__xssMarker && window.__xssMarker()</script>'
    await page.getByLabel(/Nota/i).fill(payload)
    await page.getByRole('dialog').getByRole('button', { name: /^Rechazar$/ }).click()

    // Then the dialog closes
    await expect(page.getByText(/Rechazar cambio/i)).not.toBeVisible({ timeout: 10000 })

    // Wait for the GET to refire and the badge to update.
    await expect(historySection.getByText(/Rechazado/i).first()).toBeVisible({ timeout: 10000 })

    // And the XSS payload renders as escaped text — not as an executable
    // element, and the marker never ran.  We check the full body because
    // the note paragraph is rendered after the field list.
    const bodyHtml = await page.evaluate(() => document.body.innerHTML)
    expect(bodyHtml).toContain('&lt;script&gt;')
    expect(bodyHtml).toContain('&lt;/script&gt;')
    expect(bodyHtml).not.toMatch(/<script>window\.__xssMarker/)
    expect(xssFired).toBe(false)
  })
})
