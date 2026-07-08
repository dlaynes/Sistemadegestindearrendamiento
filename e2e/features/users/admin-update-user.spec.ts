import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Característica: Edición de usuario', () => {
  test('Escenario: El administrador cambia el rol de un usuario de arrendador a inquilino', async ({ page }) => {
    // Given: I am logged in as an administrator
    // (loginAs registers the shared catch-all first; the specific route
    // below must be registered afterwards so it takes precedence.)
    await loginAs(page, 'administrador');

    // Capture the PUT body so we can assert the form sent the right shape.
    let putBody: Record<string, unknown> | null = null;
    let putHappened = false;
    await page.route('**/api/admin/users/2', async (route) => {
      if (route.request().method() === 'PUT') {
        putHappened = true;
        try {
          putBody = JSON.parse(route.request().postData() || '{}');
        } catch {
          /* ignore */
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 2,
            name: 'Landlord User',
            email: 'landlord@test.com',
            role: 'inquilino',
            status: 'activo',
          }),
        });
        return;
      }
      // GET: return the user detail so the page renders the heading "Landlord User".
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 2,
            name: 'Landlord User',
            email: 'landlord@test.com',
            role: 'arrendador',
            status: 'activo',
          }),
        });
        return;
      }
      // Default: just return a 200 so the page renders without error.
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    // When: I navigate to the user detail page
    await page.goto('/administrador/usuarios/2');
    await expect(page.getByRole('heading', { name: /Landlord User/ })).toBeVisible({ timeout: 10000 });

    // And: I click "Editar usuario"
    await page.getByRole('button', { name: /Editar usuario/ }).click();
    await expect(page).toHaveURL('/administrador/usuarios/2/editar', { timeout: 10000 });

    // And: I change the role to "inquilino"
    // The form uses FormField which renders a <label htmlFor> linked to the
    // select id, so getByLabel resolves to the accessible-name of the select.
    // The option list has a "Selecciona un rol" placeholder with empty value
    // and three real options (administrador, arrendador, inquilino) — pick
    // the one whose value is 'inquilino'.
    await page.locator('select').filter({ has: page.locator('option', { hasText: /^Inquilino$/ }) }).selectOption({ label: 'Inquilino' });

    // And: I save the changes
    await page.getByRole('button', { name: /Guardar/ }).click();

    // Then: the PUT endpoint was called with the new role
    await expect(page).toHaveURL('/administrador/usuarios', { timeout: 10000 });
    expect(putHappened).toBe(true);
    expect(putBody).not.toBeNull();
    expect(putBody!.role).toBe('inquilino');
  });
});
