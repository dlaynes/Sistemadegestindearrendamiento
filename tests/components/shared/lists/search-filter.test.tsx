import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchFilter } from '@/app/components/shared/lists/search-filter'

describe('SearchFilter', () => {
  it('renders search input and fires onSearchChange', () => {
    const onSearchChange = vi.fn()
    render(
      <SearchFilter
        searchValue=""
        onSearchChange={onSearchChange}
      />
    )

    const input = screen.getByPlaceholderText('Buscar...')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(onSearchChange).toHaveBeenCalledWith('test')
  })

  it('renders select when options provided', () => {
    const onSelectChange = vi.fn()
    render(
      <SearchFilter
        searchValue=""
        onSearchChange={vi.fn()}
        selectValue=""
        selectOptions={[{ value: 'a', label: 'Option A' }]}
        selectPlaceholder="Filtrar"
        onSelectChange={onSelectChange}
      />
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'a' } })
    expect(onSelectChange).toHaveBeenCalledWith('a')
  })
})
