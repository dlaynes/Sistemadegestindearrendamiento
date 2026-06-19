import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Feature: Contract amendments', () => {
  test('Scenario: Landlord proposes and approves a rent amendment', async ({ page }) => {
    // Given I am logged in as a landlord viewing a contract
    await loginAs(page, 'arrendador')
    await page.goto('/arrendador/contratos/1')

    // When I open the propose-amendment dialog from the amendment history section
    // (the section is the one titled "Historial de enmiendas"; scoping avoids the
    // duplicate "Proponer cambio" button in the right-rail SidebarActions.)
    const historySection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Historial de enmiendas' }),
    })
    await historySection.getByRole('button', { name: 'Proponer cambio' }).click()
    await expect(page.getByText(/El cambio requiere la aprobaci/i)).toBeVisible()

    // And I fill in the new monthly rent
    await page.getByLabel('Renta mensual').fill('1700')

    // And I submit the proposal
    // The dialog sits inside a <div role="dialog">; scoping the click there
    // avoids matching the second "Proponer"-texted button on the page.
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: /^Proponer$/ }).click()

    // Then the amendment is created and shown as pending.
    // Wait for the dialog to close first (proves the mutation succeeded);
    // then wait for the empty-state placeholder to disappear (proves the
    // react-query invalidation + refetch returned the new amendment); then
    // assert the status badge text is visible in the history section.
    await expect(page.getByText(/El cambio requiere la aprobaci/i)).not.toBeVisible({ timeout: 10000 })
    await expect(historySection.getByText(/Sin enmiendas todavía/i)).not.toBeVisible({ timeout: 10000 })
    // The mock makes the tenant the proposer (proposedByUserId=3) and the
    // amendment status pending_landlord, so the landlord sees the
    // "Pendiente: arrendador" badge (the OTHER party must decide).
    await expect(historySection.getByText(/Pendiente: arrendador/i)).toBeVisible({ timeout: 10000 })
    // Wait for the decide button to render before we try to click it.
    await expect(historySection.getByRole('button', { name: /^Aprobar$/ })).toBeVisible({ timeout: 10000 })

    // When I approve the pending amendment
    // The card's "Aprobar" button (icon-prefixed) opens the decision dialog.
    await page.getByRole('button', { name: /^Aprobar$/ }).first().click()
    // The decision dialog has its own "Aprobar" submit button (the second
    // button with that accessible name on the page).
    await page.getByRole('button', { name: /^Aprobar$/ }).last().click()

    // Then the amendment is shown as approved
    await expect(page.getByText(/Aprobado/i).first()).toBeVisible({ timeout: 10000 })
  })
})
