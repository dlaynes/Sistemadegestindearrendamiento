import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Característica: Panel de control - actividad reciente', () => {
  test('Escenario: El administrador ve el feed de actividad reciente en el panel', async ({ page }) => {
    // Dado que he iniciado sesión como administrador
    await loginAs(page, 'administrador')

    // Cuando navego al panel del administrador
    await expect(page).toHaveURL('/administrador/dashboard')

    // Entonces veo la sección "Actividad Reciente"
    await expect(
      page.getByRole('heading', { name: 'Actividad Reciente' }),
    ).toBeVisible({ timeout: 10000 })

    // Y veo al menos un evento de pago recibido en el feed
    // (the MSW handler returns a payment_received row by default).
    await expect(page.getByText(/Pago de \$/)).toBeVisible({ timeout: 10000 })
  })
})
