import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AlertBox } from '@/app/components/shared/alert-box'

describe('AlertBox', () => {
  it.each([
    ['success'],
    ['error'],
    ['warning'],
    ['info'],
  ] as const)('renders %s alert with correct message', (type) => {
    render(<AlertBox message={`${type} message`} type={type} />)
    expect(screen.getByText(`${type} message`)).toBeInTheDocument()
  })
})
