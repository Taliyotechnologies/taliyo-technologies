import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'appearance';

const defaultState = {
  fontSize: 'medium', // 'small' | 'medium' | 'large'
  compact: false,
  reduceMotion: false,
  highContrast: false,
};

const readStored = () => {
  if (typeof window === 'undefined') return { ...defaultState };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch {
    return { ...defaultState };
  }
};

const applyToDocument = (state) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-font', state.fontSize);
  root.setAttribute('data-compact', String(!!state.compact));
  root.setAttribute('data-reduce-motion', String(!!state.reduceMotion));
  root.setAttribute('data-contrast', state.highContrast ? 'high' : 'normal');
};

export default function useAppearance() {
  const [appearance, setAppearance] = useState(readStored);

  // Apply on mount and when settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance));
    } catch {}
    applyToDocument(appearance);
  }, [appearance]);

  // Ensure settings are applied on first mount as well
  useEffect(() => {
    applyToDocument(readStored());
  }, []);

  const setFontSize = useCallback((v) => {
    setAppearance((prev) => ({ ...prev, fontSize: v }));
  }, []);

  const setCompact = useCallback((v) => {
    setAppearance((prev) => ({ ...prev, compact: !!v }));
  }, []);

  const setReduceMotion = useCallback((v) => {
    setAppearance((prev) => ({ ...prev, reduceMotion: !!v }));
  }, []);

  const setHighContrast = useCallback((v) => {
    setAppearance((prev) => ({ ...prev, highContrast: !!v }));
  }, []);

  return {
    ...appearance,
    setFontSize,
    setCompact,
    setReduceMotion,
    setHighContrast,
  };
}
