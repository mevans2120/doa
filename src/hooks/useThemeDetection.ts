'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/**
 * Custom hook to detect and monitor the browser's color scheme preference
 * @returns {Theme} The current theme ('light' or 'dark')
 */
export function useThemeDetection(): Theme {
  // Initialize state with a default value
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Create media query for dark mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Handler for theme changes
    const handleThemeChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    // Set initial theme based on current preference
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes to the color scheme preference
    // Modern browsers use addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleThemeChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleThemeChange);
    }

    // Cleanup listener on unmount
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleThemeChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleThemeChange);
      }
    };
  }, []);

  return theme;
}

/**
 * Utility function to check if user prefers dark mode
 * Can be used outside of React components
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}