import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderWithProviders } from '../../../utils/test-utils'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MessagesInterface } from '@/app/components/shared/messages/messages-interface'
import { AuthProvider } from '@/app/contexts/auth-context'

function setUser(user: { id: number; role: string; name: string }) {
  localStorage.setItem('rentmanager_user', JSON.stringify(user))
}

function renderMessages() {
  return renderWithProviders(
    <AuthProvider>
      <MessagesInterface />
    </AuthProvider>
  )
}

describe('MessagesInterface', () => {
  beforeEach(() => {
    setUser({ id: 1, role: 'arrendador', name: 'Test User' })
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders the conversation list from the API', async () => {
    renderMessages()
    const conversation = await screen.findByRole('button', { name: /Landlord One/i })
    expect(conversation).toBeInTheDocument()
  })

  it('auto-selects the first conversation and shows its messages', async () => {
    renderMessages()
    const conversation = await screen.findByRole('button', { name: /Landlord One/i })
    const thread = await screen.findByText(/Hello tenant/i)
    expect(thread).toBeInTheDocument()
    expect(conversation).toHaveAttribute('aria-current', 'true')
  })

  it('sends a message when the composer is submitted', async () => {
    const user = userEvent.setup()
    renderMessages()
    const composer = (await screen.findByRole('textbox', { name: /Mensaje/i })) as HTMLTextAreaElement
    await user.type(composer, 'Hello from test')
    const sendButton = screen.getByRole('button', { name: /Enviar mensaje/i })
    await user.click(sendButton)
    await waitFor(() => expect(composer.value).toBe(''))
  })

  it('disables the send button when the composer is empty', async () => {
    renderMessages()
    const sendButton = await screen.findByRole('button', { name: /Enviar mensaje/i })
    expect(sendButton).toBeDisabled()
  })
})
