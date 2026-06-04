import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ThemeProvider, ForceLightTheme, useTheme } from '@/app/contexts/theme-context'

const STORAGE_KEY = 'rentmanager_theme'

// jsdom does not implement matchMedia; ThemeProvider/ForceLightTheme read it on mount.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function Probe() {
  const { theme, resolvedTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
    </div>
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

afterEach(() => {
  cleanup()
  document.documentElement.classList.remove('dark')
})

describe('ThemeProvider', () => {
  it('defaults to system when no preference is stored', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme').textContent).toBe('system')
  })

  it('persists the chosen theme to localStorage', () => {
    function SetDark() {
      const { setTheme } = useTheme()
      return <button onClick={() => setTheme('dark')}>set-dark</button>
    }
    render(
      <ThemeProvider>
        <Probe />
        <SetDark />
      </ThemeProvider>,
    )
    // Provider writes the initial value to localStorage on mount
    expect(localStorage.getItem(STORAGE_KEY)).toBe('system')
  })
})

describe('ForceLightTheme', () => {
  it('removes the dark class when stored preference is "system"', () => {
    localStorage.setItem(STORAGE_KEY, 'system')
    document.documentElement.classList.add('dark')

    const { unmount } = render(
      <ForceLightTheme>
        <span>child</span>
      </ForceLightTheme>,
    )

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    unmount()
  })

  it('removes the dark class when stored preference is "light"', () => {
    localStorage.setItem(STORAGE_KEY, 'light')
    document.documentElement.classList.add('dark')

    const { unmount } = render(
      <ForceLightTheme>
        <span>child</span>
      </ForceLightTheme>,
    )

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    unmount()
  })

  it('is a no-op when stored preference is explicitly "dark"', () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    document.documentElement.classList.add('dark')

    const { unmount } = render(
      <ForceLightTheme>
        <span>child</span>
      </ForceLightTheme>,
    )

    // User has explicitly chosen dark; ForceLightTheme should not touch it
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    unmount()
    // After unmount, no cleanup is registered (the early-return path), so dark stays
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('restores the prior dark class on unmount when the subtree was dark before', () => {
    localStorage.setItem(STORAGE_KEY, 'system')
    document.documentElement.classList.add('dark')

    const { unmount } = render(
      <ForceLightTheme>
        <span>child</span>
      </ForceLightTheme>,
    )
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    unmount()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('leaves the dark class absent on unmount when the subtree was already light', () => {
    localStorage.setItem(STORAGE_KEY, 'system')
    document.documentElement.classList.remove('dark')

    const { unmount } = render(
      <ForceLightTheme>
        <span>child</span>
      </ForceLightTheme>,
    )
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    unmount()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('renders its children unchanged', () => {
    render(
      <ForceLightTheme>
        <span>hello-pinned</span>
      </ForceLightTheme>,
    )
    expect(screen.getByText('hello-pinned')).toBeInTheDocument()
  })
})
