import { useEffect, useState, useCallback } from 'react';

const THEME_KEY = 'theme'; // values: 'light' | 'dark' | 'auto'

const getSystemPrefersDark = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyThemeClass = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const prefersDark = getSystemPrefersDark();
  const effective = theme === 'dark' || (theme === 'auto' && prefersDark) ? 'dark' : 'light';
  if (effective === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  root.style.colorScheme = effective;
};

export default function useTheme() {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'auto';
    return localStorage.getItem(THEME_KEY) || 'auto';
  });

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(THEME_KEY) || 'auto';
    return stored === 'dark' || (stored === 'auto' && getSystemPrefersDark());
  });

  // Apply theme to document and persist
  useEffect(() => {
    try {
      applyThemeClass(theme);
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_KEY, theme);
      }
      // Update isDark when theme changes
      setIsDark(theme === 'dark' || (theme === 'auto' && getSystemPrefersDark()));
    } catch (_) {
      // no-op
    }
  }, [theme]);

  // Listen for system preference changes when theme is auto
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (theme === 'auto') {
        applyThemeClass('auto');
        setIsDark(getSystemPrefersDark());
      }
    };
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const effectiveTheme = isDark ? 'dark' : 'light';

  return { theme, setTheme, toggleTheme, isDark, effectiveTheme };
}
