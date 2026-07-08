import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Característica: Exportación de reportes', () => {
  test('Escenario: El administrador descarga el reporte de contratos', async ({ page }) => {
    // Given: I am logged in as an administrator
    // (loginAs must happen before the route override because the shared
    // catch-all is registered first and would otherwise win.)
    await loginAs(page, 'administrador');

    // Capture the GET that triggers the download so we can assert the URL
    // and the response shape (xlsx blob with the right content-type).
    let downloadRequested = false;
    let lastDownloadUrl = '';
    await page.route('**/api/admin/reports/contracts/download', async (route) => {
      downloadRequested = true;
      lastDownloadUrl = route.request().url();
      // Return a minimal valid-looking xlsx payload. The browser treats this
      // as a download; we just need the content-type to be the xlsx mime.
      const body = Buffer.from('PK\x03\x04fake-xlsx-content', 'binary');
      await route.fulfill({
        status: 200,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: {
          'Content-Disposition': 'attachment; filename="reporte-contracts.xlsx"',
        },
        body,
      });
    });

    // Wire up Playwright's download listener so we can verify the browser
    // actually received a file (not just an HTTP 200).
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });

    // When: I navigate to "Reportes"
    await page.goto('/administrador/reportes');
    await expect(
      page.getByRole('heading', { name: 'Reportes' }),
    ).toBeVisible({ timeout: 10000 });

    // And: I click "Descargar" on the "Reporte de Contratos" card.
    // The page has 6 "Descargar" buttons (one per report). Naive
    // `locator('div').filter(has: heading).first()` matches the grid
    // container, not the card. We anchor on the card directly via the
    // descendant combinator and the heading's closest <div> ancestor
    // that has the `bg-card` class (the card-level container).
    const heading = page.getByRole('heading', { name: 'Reporte de Contratos', exact: true });
    const card = heading.locator('xpath=ancestor::div[contains(@class, "bg-card")][1]');
    await card.getByRole('button', { name: 'Descargar' }).click();

    // Then: the download endpoint was hit
    await expect.poll(() => downloadRequested, { timeout: 5000 }).toBe(true);
    expect(lastDownloadUrl).toContain('/api/admin/reports/contracts/download');

    // And: the browser actually received a download with the right filename
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('reporte-contracts.xlsx');
  });
});
