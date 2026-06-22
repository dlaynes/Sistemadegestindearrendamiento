import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Característica: Panel de control - actividad reciente del inquilino', () => {
  test('Escenario: El inquilino ve el feed de actividad reciente en su panel', async ({ page }) => {
    // Dado que he iniciado sesión como inquilino
    await loginAs(page, 'inquilino')

    // Cuando navego al panel del inquilino
    await expect(page).toHaveURL('/inquilino/dashboard')

    // Entonces veo la sección "Actividad Reciente"
    await expect(
      page.getByRole('heading', { name: 'Actividad Reciente' }),
    ).toBeVisible({ timeout: 10000 })

    // Y veo al menos un evento relacionado con mis pagos en el feed
    // (the tenant feed fixture includes a "Tu pago de $1,500 fue confirmado." row).
    await expect(page.getByText(/Tu pago de \$/)).toBeVisible({ timeout: 10000 })
  })
})
