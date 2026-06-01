import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from '@/app/components/shared/forms/form-field'

describe('FormField', () => {
  it('renders label and required indicator', () => {
    render(
      <FormField label="Nombre" required>
        <input />
      </FormField>
    )

    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('clones child with aria-invalid when error present', () => {
    render(
      <FormField label="Email" error="Invalid email">
        <input data-testid="input" />
      </FormField>
    )

    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-errormessage')
  })

  it('shows error message with role alert', () => {
    render(
      <FormField label="Email" error="Invalid email">
        <input />
      </FormField>
    )

    const error = screen.getByText('Invalid email')
    expect(error).toHaveAttribute('role', 'alert')
  })

  it('shows help text when no error', () => {
    render(
      <FormField label="Email" helpText="Use a valid email">
        <input />
      </FormField>
    )

    expect(screen.getByText('Use a valid email')).toBeInTheDocument()
  })
})
