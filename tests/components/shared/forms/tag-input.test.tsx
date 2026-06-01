import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TagInput } from '@/app/components/shared/forms/tag-input'

describe('TagInput', () => {
  it('adds tag on button click', () => {
    const onTagsChange = vi.fn()
    render(<TagInput tags={[]} onTagsChange={onTagsChange} />)

    const input = screen.getByPlaceholderText('Agregar...')
    fireEvent.change(input, { target: { value: 'wifi' } })
    fireEvent.click(screen.getByText('Agregar'))

    expect(onTagsChange).toHaveBeenCalledWith(['wifi'])
  })

  it('adds tag on Enter key', () => {
    const onTagsChange = vi.fn()
    render(<TagInput tags={[]} onTagsChange={onTagsChange} />)

    const input = screen.getByPlaceholderText('Agregar...')
    fireEvent.change(input, { target: { value: 'pool' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(onTagsChange).toHaveBeenCalledWith(['pool'])
  })

  it('removes tag on X click', () => {
    const onTagsChange = vi.fn()
    render(<TagInput tags={['wifi', 'pool']} onTagsChange={onTagsChange} />)

    const removeButtons = screen.getAllByRole('button').filter((b) =>
      b.querySelector('svg')
    )
    fireEvent.click(removeButtons[0])

    expect(onTagsChange).toHaveBeenCalledWith(['pool'])
  })

  it('shows label and required indicator', () => {
    render(<TagInput tags={[]} onTagsChange={vi.fn()} label="Amenities" required />
    )

    expect(screen.getByText('Amenities')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows error text', () => {
    render(
      <TagInput tags={[]} onTagsChange={vi.fn()} error="At least one tag required" />
    )

    expect(screen.getByText('At least one tag required')).toBeInTheDocument()
  })
})
