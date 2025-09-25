'use client'

import { useEffect } from 'react'
import { suppressConsoleWarnings } from '@/utils/suppressConsoleWarnings'

export function ConsoleSuppress() {
  useEffect(() => {
    suppressConsoleWarnings()
  }, [])

  return null
}