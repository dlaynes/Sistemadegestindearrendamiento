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
 * Pin the document to light mode for the current subtree — UNLESS the
 * user has explicitly chosen 'dark' (i.e. their stored preference is not
 * 'system' or 'light'). Public pages (welcome / login / invitation) want
 * a light-by-default look, but should not fight a user who has actively
 * toggled the site into dark mode.
 *
 * Cleans up on unmount by re-applying whatever the global theme provider
 * last stored — so returning to the app restores the user's preference.
 */
function ForceLightTheme({ children }: { children: ReactNode }) {
  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
    if (stored === 'dark') {
      // User has explicitly chosen dark. Leave the subtree alone.
      return;
    }
    const previousWasDark = ROOT.classList.contains('dark');
    ROOT.classList.remove('dark');
    return () => {
      if (previousWasDark) ROOT.classList.add('dark');
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

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}
