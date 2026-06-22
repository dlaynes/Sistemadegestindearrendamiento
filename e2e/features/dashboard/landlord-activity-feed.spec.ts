import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Característica: Panel de control - actividad reciente del arrendador', () => {
  test('Escenario: El arrendador ve el feed de actividad reciente en su panel', async ({ page }) => {
    // Dado que he iniciado sesión como arrendador
    await loginAs(page, 'arrendador')

    // Cuando navego al panel del arrendador
    await expect(page).toHaveURL('/arrendador/dashboard')

    // Entonces veo la sección "Actividad Reciente"
    await expect(
      page.getByRole('heading', { name: 'Actividad Reciente' }),
    ).toBeVisible({ timeout: 10000 })

    // Y veo al menos un evento de pago recibido en el feed
    // (the landlord feed fixture includes a payment_received row).
    await expect(page.getByText(/Pago de \$/)).toBeVisible({ timeout: 10000 })
  })
})
