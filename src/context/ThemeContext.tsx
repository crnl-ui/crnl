import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

/** A theme slug from themes.css, or '' for the base theme. Open by design:
 *  a project adds a [data-theme] block and uses its slug with no change here. */
type Theme = string
type Mode = 'light' | 'dark'
type Platform = 'web' | 'app'

interface ThemeContextValue {
  theme: Theme
  mode: Mode
  platform: Platform
  setTheme: (theme: Theme) => void
  setMode: (mode: Mode) => void
  setPlatform: (platform: Platform) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('')
  const [mode, setModeState] = useState<Mode>('light')
  const [platform, setPlatformState] = useState<Platform>('web')

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    if (t) document.documentElement.setAttribute('data-theme', t)
    else document.documentElement.removeAttribute('data-theme')
  }, [])

  const setMode = useCallback((m: Mode) => {
    setModeState(m)
    document.documentElement.setAttribute('data-mode', m)
  }, [])

  const setPlatform = useCallback((p: Platform) => {
    setPlatformState(p)
    document.documentElement.setAttribute('data-platform', p)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, mode, platform, setTheme, setMode, setPlatform }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
