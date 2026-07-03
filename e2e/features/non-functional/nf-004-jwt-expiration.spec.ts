import { test, expect, loginAs } from '../_shared/fixtures'

/**
 * TC-NF-004 — Expiración del token JWT después de 1 hora
 *
 * Verifica que un JWT expirado (o cualquier 401) hace que apiFetch
 * limpie el storage y redirija al usuario a /login.
 */
test.describe('No funcional: Expiración del token JWT', () => {
  test('Un token expirado recibe 401, limpia el storage y redirige a /login', async ({ page }) => {
    // Given: I am logged in as a landlord
    await loginAs(page, 'arrendador')

    // When: I make a request that the BE rejects with 401 (simulating an
    // expired token) — we patch the auth-context to use a bogus token
    // BEFORE any other request fires, so the next API call hits 401.
    // The fixtures' `mockApi` does not know how to return 401, so we add
    // a higher-priority route that returns 401 for the /properties GET.
    await page.unroute('**/api/landlord/properties').catch(() => {})
    await page.route('**/api/landlord/properties', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Token expired' }),
      })
    })

    // Force a navigation that triggers a 401 on a protected endpoint.
    // The auth-context will see the 401, clear localStorage and redirect
    // to /login (see apiFetch in src/app/services/api-client.ts).
    // Use waitUntil: 'commit' so a navigation aborted by an in-flight
    // redirect (auth-context kicking in on 401) doesn't surface as
    // ERR_ABORTED. The toHaveURL check below still catches the redirect.
    await page.goto('/arrendador/propiedades', { waitUntil: 'commit' }).catch(() => {})

    // Then: the user is redirected to /login
    await expect(page).toHaveURL(/\/login$/, { timeout: 10000 })

    // And: the storage was cleared (token + user)
    const tokenAfter = await page.evaluate(() => localStorage.getItem('token'))
    const userAfter = await page.evaluate(() => localStorage.getItem('rentmanager_user'))
    expect(tokenAfter).toBeNull()
    expect(userAfter).toBeNull()
  })
})
