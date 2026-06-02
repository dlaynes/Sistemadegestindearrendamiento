import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'rentmanager_theme';
const ROOT = document.documentElement;

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme): 'light' | 'dark' {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  if (resolved === 'dark') {
    ROOT.classList.add('dark');
  } else {
    ROOT.classList.remove('dark');
  }
  return resolved;
}

/**
 * Force the document into light mode for the current subtree, without
 * disturbing the user's stored preference. Used by the public pages
 * (welcome / login / invitation) which are light-only by design.
 *
 * Cleans up on unmount by re-applying whatever the global theme provider
 * last stored — so returning to the app restores the user's preference.
 */
function ForceLightTheme({ children }: { children: ReactNode }) {
  useEffect(() => {
    const previous = ROOT.classList.contains('dark') ? 'dark' : 'light';
    ROOT.classList.remove('dark');
    return () => {
      if (previous === 'dark') ROOT.classList.add('dark');
    };
  }, []);
  return <>{children}</>;
}

export { ForceLightTheme };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(STORAGE_KEY) as Theme;
    return applyTheme(stored || 'system');
  });

  useEffect(() => {
    const resolved = applyTheme(theme);
    setResolvedTheme(resolved);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light';
      applyTheme(resolved);
      setResolvedTheme(resolved);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const current = prev === 'system' ? getSystemTheme() : prev;
      return current === 'dark' ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}
