import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Característica: Registro de pago', () => {
  test('Escenario: El inquilino registra un nuevo pago', async ({ page }) => {
    // Given: I am logged in as a tenant (this also registers baseline API mocks)
    await loginAs(page, 'inquilino');

    // Capture the POST body so we can assert the form sent the right shape.
    // NB: must be attached AFTER loginAs, because Playwright's matching is
    // last-registered-wins and loginAs's mockApi registers a generic handler
    // for **/api/tenant/payments that returns [mockPayment] (no id field).
    let postedBody: Record<string, unknown> | null = null;
    let postHappened = false;
    await page.unroute('**/api/tenant/payments').catch(() => {});
    await page.route('**/api/tenant/payments', async (route) => {
      if (route.request().method() === 'POST') {
        postHappened = true;
        try {
          postedBody = JSON.parse(route.request().postData() || '{}');
        } catch {
          /* ignore */
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 77,
            contractId: 1,
            tenantId: 3,
            tenantName: 'Tenant User',
            property: 'Cozy Apartment',
            amount: '$1,500',
            status: 'pagado',
            method: 'transferencia',
            dueDate: '2026-07-03',
            paidDate: '2026-07-03',
            referenceNumber: 'REF-001',
            notes: '',
          }),
        });
        return;
      }
      // GET: return an empty list so the post-create list refresh doesn't 404.
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // When: I navigate to the payment form for contract 1
    await page.goto('/inquilino/contratos/1/pagos/nuevo');
    await expect(page.getByRole('heading', { name: /Registrar Pago/i })).toBeVisible({ timeout: 10000 });

    // And: I fill in the payment data
    // The InquilinoPaymentForm renders labels as plain <label> elements
    // (no htmlFor, not wrapping the input), so getByLabel cannot resolve
    // the accessible name. We scope to the <form> and use positional
    // selectors: 3 spinbuttons (Monto/Servicios/Mora), 1 date input,
    // 3 <select>s (Mes/Año/Método), and Referencia via its unique placeholder.
    // Option values are the capitalized month name, the year as string, and
    // the lowercase method token respectively.
    const form = page.locator('form');
    await form.getByRole('spinbutton').nth(0).fill('1500');
    await form.locator('input[type="date"]').fill('2026-07-03');
    await form.locator('select').nth(0).selectOption('Julio');
    await form.locator('select').nth(1).selectOption('2026');
    await form.locator('select').nth(2).selectOption('transferencia');
    await form.getByPlaceholder('Ej: TRANS-123456789').fill('REF-001');

    // And: I submit the form
    await page.getByRole('button', { name: /Registrar Pago/ }).click();

    // Then: the POST endpoint was called with the right body
    // The form calls useRoleNavigation('/pagos/:id') which prefixes the
    // tenant role, landing us on /inquilino/pagos/:id.
    await expect(page).toHaveURL('/inquilino/pagos/77', { timeout: 10000 });
    expect(postHappened).toBe(true);
    expect(postedBody).not.toBeNull();
    const body = postedBody as Record<string, unknown>;
    expect(body.contractId).toBe(1);
    expect(body.status).toBe('pagado');
    expect(body.method).toBe('transferencia');
    expect(body.dueDate).toBe('2026-07-03');
    expect(body.paidDate).toBe('2026-07-03');
    expect(body.referenceNumber).toBe('REF-001');
  });
});
