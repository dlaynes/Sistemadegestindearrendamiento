import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Característica: Creación de propiedad', () => {
  test('Escenario: El arrendador crea una propiedad nueva', async ({ page }) => {
    // Given: I am logged in as a landlord (this also registers baseline API mocks)
    await loginAs(page, 'arrendador');

    // Capture the POST body so we can assert the form sent the right shape.
    // NB: must be attached AFTER loginAs, because Playwright's matching is
    // last-registered-wins and loginAs's mockApi registers a generic handler
    // for **/api/landlord/properties that returns [mockProperty].
    let postedBody: unknown = null;
    let postedToCreate = false;
    await page.unroute('**/api/landlord/properties').catch(() => {});
    await page.route('**/api/landlord/properties', async (route) => {
      if (route.request().method() === 'POST') {
        postedToCreate = true;
        try {
          postedBody = JSON.parse(route.request().postData() || '{}');
        } catch {
          /* ignore */
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 99,
            name: 'Casa Playa',
            address: 'Av. Costanera 123',
            type: 'casa',
            bedrooms: 3,
            bathrooms: 2,
            area: '150',
            rent: '2000',
            status: 'disponible',
            description: 'Casa frente al mar con piscina.',
            yearBuilt: 2022,
            floors: 2,
            furnished: true,
            amenities: ['Piscina'],
            ownerId: 2,
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

    // When: I navigate to the properties page and then to "Nueva Propiedad"
    await page.goto('/arrendador/propiedades');
    await page.getByRole('button', { name: /Nueva Propiedad/i }).click();
    await expect(page).toHaveURL('/arrendador/propiedades/nueva');

    // And: I fill the form with valid data
    // The ArrendadorPropertyForm uses FormField (label htmlFor bound to the
    // input id), so getByLabel resolves to the accessible name. The "Tipo"
    // <select> options render the capitalized Spanish word as both label and
    // value (Apartamento, Casa, Estudio, …), so we pick the option by label.
    await page.getByLabel('Nombre de la propiedad').fill('Casa Playa');
    await page.getByLabel('Dirección').fill('Av. Costanera 123');
    // The "Tipo" field is a <select>. The option <value> is the capitalized
    // Spanish word (Casa), not the lowercase token used by the BE.
    await page.getByLabel('Tipo de propiedad').selectOption('Casa');
    await page.getByLabel('Habitaciones').fill('3');
    await page.getByLabel('Baños').fill('2');
    await page.getByLabel('Área (m²)').fill('150');
    await page.getByLabel('Pisos').fill('2');
    await page.getByLabel('Año de construcción').fill('2022');
    await page.getByLabel('Renta mensual').fill('2000');
    await page.getByLabel('Descripción de la propiedad').fill('Casa frente al mar con piscina.');

    // And: I submit the form
    await page.getByRole('button', { name: /Guardar|Crear/i }).first().click();

    // Then: I am redirected to the property list
    await expect(page).toHaveURL('/arrendador/propiedades', { timeout: 10000 });

    // And: the POST endpoint was called with the form's body
    expect(postedToCreate).toBe(true);
    expect(postedBody).not.toBeNull();
    const body = postedBody as Record<string, unknown>;
    expect(body.name).toBe('Casa Playa');
    expect(body.address).toBe('Av. Costanera 123');
    // The <select> options use the capitalized Spanish word as their value
    // (Apartamento, Casa, Estudio, ...). The form submits the option's value
    // verbatim, so the body carries 'Casa' here.
    expect(body.type).toBe('Casa');
    expect(String(body.bedrooms)).toBe('3');
    expect(String(body.bathrooms)).toBe('2');
    expect(String(body.rent)).toBe('2000');
  });
});
