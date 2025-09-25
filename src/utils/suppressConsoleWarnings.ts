// Suppress specific console warnings in production
export function suppressConsoleWarnings() {
  // Only suppress in production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const originalError = console.error;
  const originalWarn = console.warn;

  // List of warnings to suppress
  const suppressedWarnings = [
    'disableTransition',
    'React does not recognize the',
    'Invalid DOM property',
    'Unknown DOM property',
  ];

  // Override console.error
  console.error = (...args) => {
    const message = args.join(' ');

    // Check if this is a warning we want to suppress
    const shouldSuppress = suppressedWarnings.some(warning =>
      message.includes(warning)
    );

    if (!shouldSuppress) {
      originalError.apply(console, args);
    }
  };

  // Override console.warn
  console.warn = (...args) => {
    const message = args.join(' ');

    // Check if this is a warning we want to suppress
    const shouldSuppress = suppressedWarnings.some(warning =>
      message.includes(warning)
    );

    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };
}