import { describe, it, expect, beforeEach } from 'vitest'
import { ApiMessageService } from '@/app/services/message.service'

const service = new ApiMessageService()

function setUser(userId: number) {
  localStorage.setItem('rentmanager_user', JSON.stringify({ id: userId, role: 'arrendador' }))
}

describe('MessageService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getConversations maps response fields', async () => {
    setUser(1)
    const conversations = await service.getConversations()
    expect(conversations).toHaveLength(1)
    expect(conversations[0].name).toBe('Landlord One')
    expect(conversations[0].unread).toBe(0)
  })

  it('startConversation returns conversation', async () => {
    setUser(1)
    const conversation = await service.startConversation(2)
    expect(conversation.id).toBe(1)
    expect(conversation.participantId).toBe(2)
  })

  it('getMessages maps sender to me/other', async () => {
    setUser(1)
    const messages = await service.getMessages(1)
    expect(messages).toHaveLength(1)
    expect(messages[0].sender).toBe('other')
  })

  it('sendMessage returns sent message', async () => {
    setUser(1)
    const message = await service.sendMessage(1, 'Hello')
    expect(message.content).toBe('Hello tenant')
  })

  it('markAsRead does not throw', async () => {
    setUser(1)
    await expect(service.markAsRead(1)).resolves.not.toThrow()
  })
})
