import { describe, it, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '../../utils/test-utils'
import {
  useConversations,
  useMessages,
  useSendMessage,
} from '@/app/hooks/queries/use-messages-query'

function setUser(role: string) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ id: 1, role, name: 'Test' }))
}

describe('useMessages query hooks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('useConversations returns list', async () => {
    setUser('arrendador')
    const { result } = renderHookWithProviders(() => useConversations())

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].name).toBe('Landlord One')
  })

  it('useMessages returns messages when conversationId provided', async () => {
    setUser('arrendador')
    const { result } = renderHookWithProviders(() => useMessages(1))

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].content).toBe('Hello tenant')
  })

  it('useMessages is disabled when conversationId is null', () => {
    setUser('arrendador')
    const { result } = renderHookWithProviders(() => useMessages(null))
    expect(result.current.isPending).toBe(true)
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('useSendMessage mutates successfully', async () => {
    setUser('arrendador')
    const { result } = renderHookWithProviders(() => useSendMessage())

    await result.current.mutateAsync({ conversationId: 1, content: 'Hello' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
