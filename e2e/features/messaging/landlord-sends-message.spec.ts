import { test, expect, loginAs } from '../_shared/fixtures'

test.describe('Característica: Mensajería', () => {
  test('Escenario: El arrendador envía un mensaje al inquilino', async ({ page }) => {
    // Capture the POST body so we can assert the request shape.
    let postedBody: Record<string, unknown> | null = null;
    let postHappened = false;
    await page.route('**/api/conversations/1/messages', async (route) => {
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
            id: 99,
            senderId: 2,
            senderName: 'Landlord User',
            content: 'Hola, confirma el pago del mes',
            timestamp: new Date().toISOString(),
            seen: false,
          }),
        });
        return;
      }
      // GET for messages: return the existing thread with the new message appended.
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 1,
              senderId: 3,
              senderName: 'Tenant User',
              content: 'Hola arrendador',
              timestamp: '2026-07-02T10:00:00',
              seen: true,
            },
            {
              id: 99,
              senderId: 2,
              senderName: 'Landlord User',
              content: 'Hola, confirma el pago del mes',
              timestamp: new Date().toISOString(),
              seen: false,
            },
          ]),
        });
        return;
      }
      await route.fallback();
    });

    // Mock the conversation list so the user can click on the thread.
    await page.route('**/api/conversations', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 1,
              participantId: 3,
              participantName: 'Tenant User',
              lastMessage: 'Hola arrendador',
              lastMessageAt: '2026-07-02T10:00:00',
              unreadCount: 0,
            },
          ]),
        });
        return;
      }
      await route.fallback();
    });

    // Given: I am logged in as a landlord
    await loginAs(page, 'arrendador');

    // When: I navigate to "Mensajes"
    await page.getByRole('link', { name: 'Mensajes' }).click();
    await expect(page).toHaveURL('/arrendador/mensajes');

    // And: I open the conversation with "Tenant User"
    await page.getByText('Tenant User').first().click();

    // And: I type a message
    await page.getByPlaceholder('Escribe un mensaje...').fill('Hola, confirma el pago del mes');

    // And: I send the message
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    // Then: the POST endpoint was called with the right body
    await expect.poll(() => postHappened, { timeout: 5000 }).toBe(true);
    expect(postedBody).not.toBeNull();
    expect(postedBody!.content).toBe('Hola, confirma el pago del mes');
    // And: the new message is rendered in the thread
    await expect(page.getByText('Hola, confirma el pago del mes')).toBeVisible({ timeout: 10000 });
  });
});
