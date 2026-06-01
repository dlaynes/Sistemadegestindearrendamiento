import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { server } from './mocks/server'

// Start MSW before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset handlers after each test so they don't affect other tests
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

// Close MSW server after all tests
afterAll(() => server.close())
