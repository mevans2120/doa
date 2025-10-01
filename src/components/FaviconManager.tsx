'use client';

import { useEffect } from 'react';
import { useThemeDetection } from '@/hooks/useThemeDetection';

/**
 * Component that manages dynamic favicon switching based on browser theme
 * Updates all favicon link elements when theme changes
 */
export function FaviconManager() {
  const theme = useThemeDetection();

  useEffect(() => {
    // Define favicon paths for each theme
    const faviconPaths = {
      light: '/skull.svg',
      dark: '/skull-white.svg'  // Original white skull for dark mode
    };

    // Get the appropriate favicon path based on current theme
    const faviconPath = faviconPaths[theme];

    // Update all favicon link elements
    const updateFavicons = () => {
      // Remove any existing favicon links
      const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
      existingIcons.forEach(link => link.remove());

      // Create new favicon link
      const newIconLink = document.createElement('link');
      newIconLink.rel = 'icon';
      newIconLink.type = 'image/svg+xml';
      newIconLink.href = faviconPath;
      document.head.appendChild(newIconLink);

      // Create shortcut icon for older browsers
      const newShortcutLink = document.createElement('link');
      newShortcutLink.rel = 'shortcut icon';
      newShortcutLink.type = 'image/svg+xml';
      newShortcutLink.href = faviconPath;
      document.head.appendChild(newShortcutLink);

      // Create Apple touch icon
      const newAppleTouchIcon = document.createElement('link');
      newAppleTouchIcon.rel = 'apple-touch-icon';
      newAppleTouchIcon.href = faviconPath;
      document.head.appendChild(newAppleTouchIcon);

      // Log theme change for debugging
      console.log(`Favicon updated to ${theme} mode: ${faviconPath}`);
    };

    // Update favicons when theme changes
    updateFavicons();

    // Optional: Preload the alternate favicon for faster switching
    const alternateFavicon = theme === 'light' ? faviconPaths.dark : faviconPaths.light;
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = alternateFavicon;
    preloadLink.type = 'image/svg+xml';
    document.head.appendChild(preloadLink);

    // Cleanup preload on unmount or theme change
    return () => {
      if (preloadLink.parentNode) {
        preloadLink.parentNode.removeChild(preloadLink);
      }
    };
  }, [theme]);

  // This component doesn't render anything visible
  return null;
}