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
      dark: '/skull-white.svg'
    };

    // Get the appropriate favicon path based on current theme
    const faviconPath = faviconPaths[theme];

    // Update all favicon link elements
    const updateFavicons = () => {
      // Update standard favicon
      const iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (iconLink) {
        iconLink.href = faviconPath;
      } else {
        // Create icon link if it doesn't exist
        const newIconLink = document.createElement('link');
        newIconLink.rel = 'icon';
        newIconLink.href = faviconPath;
        document.head.appendChild(newIconLink);
      }

      // Update shortcut icon (for older browsers)
      const shortcutLink = document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');
      if (shortcutLink) {
        shortcutLink.href = faviconPath;
      } else {
        // Create shortcut icon link if it doesn't exist
        const newShortcutLink = document.createElement('link');
        newShortcutLink.rel = 'shortcut icon';
        newShortcutLink.href = faviconPath;
        document.head.appendChild(newShortcutLink);
      }

      // Update Apple touch icon
      const appleTouchIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
      if (appleTouchIcon) {
        appleTouchIcon.href = faviconPath;
      } else {
        // Create Apple touch icon link if it doesn't exist
        const newAppleTouchIcon = document.createElement('link');
        newAppleTouchIcon.rel = 'apple-touch-icon';
        newAppleTouchIcon.href = faviconPath;
        document.head.appendChild(newAppleTouchIcon);
      }

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