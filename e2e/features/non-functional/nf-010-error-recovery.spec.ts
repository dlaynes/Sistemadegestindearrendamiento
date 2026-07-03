import { test, expect, loginAs } from '../_shared/fixtures'

/**
 * TC-NF-010 — Recuperación ante timeout del backend en listado de pagos
 *
 * El FE actual NO muestra un banner de error explícito cuando el
 * PaymentContext setea `error`; simplemente muestra el empty state de
 * la tabla.  Eso es una degradación elegante: el usuario no ve un crash
 * ni datos corruptos, pero tampoco sabe por qué no hay datos.
 *
 * Sprint 7 backlog: agregar un banner "No se pudieron cargar los pagos"
 * + botón "Reintentar" en ArrendadorPayments.
 *
 * Por ahora el spec valida:
 *  1) la página no crashea cuando la API falla
 *  2) el empty state aparece
 *  3) al reintentar (mock devuelve datos), la tabla se llena
 */
test.describe('No funcional: Recuperación ante error de red', () => {
  test('El listado de pagos degrada elegantemente cuando la API falla', async ({ page }) => {
    // First attempt: server returns 500.
    let failNext = true
    await loginAs(page, 'arrendador')
    await page.unroute('**/api/landlord/payments').catch(() => {})

    // Capture page errors so we can assert no unhandled exceptions fired.
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    await page.route('**/api/landlord/payments', async (route) => {
      if (failNext && route.request().method() === 'GET') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' }),
        })
        return
      }
      // Subsequent requests: return the baseline fixture list.
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            contractId: 1,
            tenantId: 3,
            tenantName: 'Tenant User',
            property: 'Cozy Apartment',
            amount: '1500',
            status: 'pagado',
            method: 'transferencia',
            dueDate: '2026-05-01',
            paidDate: '2026-05-01',
          },
        ]),
      })
    })

    await page.goto('/arrendador/pagos')
    await page.waitForLoadState('networkidle')

    // Then: the page didn't crash, the URL is still /arrendador/pagos,
    // and the empty-state message is visible (graceful degradation).
    await expect(page).toHaveURL(/\/arrendador\/pagos$/)
    await expect(
      page.getByText(/no hay pagos con el filtro actual/i).first(),
    ).toBeVisible({ timeout: 10000 })
    expect(pageErrors, `unhandled page errors: ${pageErrors.join('; ')}`).toEqual([])

    // When the user retries (simulated by flipping the flag + reloading).
    failNext = false
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Then: the payment list renders successfully.  The "Tenant User"
    // row appears in the table.
    await expect(
      page.getByRole('cell', { name: /Tenant User/i }).first(),
    ).toBeVisible({ timeout: 10000 })
  })
})
