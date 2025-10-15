/**
 * Environment-aware logger utility
 * Only logs in development, silent in production (unless debugging)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerOptions {
  prefix?: string
  enabled?: boolean
}

class Logger {
  private prefix: string
  private enabled: boolean
  private isDevelopment: boolean
  private isDebug: boolean

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || ''
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true'
    this.enabled = options.enabled ?? (this.isDevelopment || this.isDebug)
  }

  private formatMessage(level: LogLevel, ...args: unknown[]): unknown[] {
    const timestamp = new Date().toISOString()
    const prefix = this.prefix ? `[${this.prefix}]` : ''
    return [`[${timestamp}] [${level.toUpperCase()}]${prefix}`, ...args]
  }

  debug(...args: unknown[]): void {
    if (this.enabled && this.isDevelopment) {
      console.debug(...this.formatMessage('debug', ...args))
    }
  }

  info(...args: unknown[]): void {
    if (this.enabled) {
      console.info(...this.formatMessage('info', ...args))
    }
  }

  warn(...args: unknown[]): void {
    if (this.enabled) {
      console.warn(...this.formatMessage('warn', ...args))
    }
  }

  error(...args: unknown[]): void {
    // Always log errors, but format them properly
    console.error(...this.formatMessage('error', ...args))
  }

  // Create a child logger with additional prefix
  child(childPrefix: string): Logger {
    const fullPrefix = this.prefix
      ? `${this.prefix}:${childPrefix}`
      : childPrefix
    return new Logger({ prefix: fullPrefix, enabled: this.enabled })
  }

  // Group console output (useful for debugging)
  group(label: string, fn: () => void): void {
    if (this.enabled && this.isDevelopment) {
      console.group(label)
      fn()
      console.groupEnd()
    } else {
      fn()
    }
  }

  // Time a function execution
  time<T>(label: string, fn: () => T): T {
    if (this.enabled && this.isDevelopment) {
      console.time(label)
      const result = fn()
      console.timeEnd(label)
      return result
    }
    return fn()
  }

  // Log with condition
  assert(condition: boolean, ...args: unknown[]): void {
    if (!condition) {
      this.error('Assertion failed:', ...args)
    }
  }
}

// Default logger instance
export const logger = new Logger()

// Specialized loggers for different parts of the app
export const apiLogger = logger.child('API')
export const cmsLogger = logger.child('CMS')
export const emailLogger = logger.child('Email')
export const performanceLogger = logger.child('Performance')

// Helper to suppress all logs (useful for tests)
export function suppressLogs(): void {
  if (typeof window === 'undefined') {
    // Node environment
    const noop = () => {}
    console.log = noop
    console.debug = noop
    console.info = noop
    console.warn = noop
    // Keep console.error for critical issues
  }
}

export default logger