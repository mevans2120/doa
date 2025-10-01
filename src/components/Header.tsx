'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAnimationPaused, setIsAnimationPaused] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const { settings } = useSiteSettings()

  // Use CMS navigation labels with fallbacks
  const navLabels = {
    home: settings.navigation?.home || 'Home',
    projects: settings.navigation?.projects || 'Our Work',
    services: settings.navigation?.services || 'What We Do',
    clients: settings.navigation?.clients || 'Our Clients',
    about: settings.navigation?.about || 'About',
    contact: settings.navigation?.contact || 'Contact'
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // Pause animation when header is out of viewport
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAnimationPaused(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(nav)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Close menu on ESC key and handle body scroll
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEsc)
      // Prevent body scroll when menu is open - also prevent iOS rubber band scrolling
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [isMenuOpen])

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-10 py-2 md:py-3 bg-gradient-to-r from-[#710000] via-[#252525] to-black bg-[length:200%_100%] backdrop-blur-sm border-b border-gray-800 z-[100] ${isAnimationPaused ? '' : 'animate-gradient-x'}`}>
        {/* Skull Logo */}
        <Link href="/" className="relative z-20 flex items-center">
          <Image
            src="/skull-white.svg"
            alt="Department of Art"
            width={28}
            height={28}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Spacer for the hamburger button */}
        <div className="w-8 h-8" />
      </nav>

      {/* Hamburger menu button - Separate from nav for proper z-indexing */}
      <button
        onClick={toggleMenu}
        className="fixed top-2 md:top-3 right-4 sm:right-6 md:right-10 z-[202] w-8 h-8 flex flex-col justify-center items-center group"
        aria-label="Toggle menu"
      >
        <span className={`block w-5 h-0.5 bg-white transition-all duration-300 group-hover:w-6 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
        <span className={`block w-5 h-0.5 bg-white my-0.5 transition-all duration-300 group-hover:w-6 ${isMenuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-white transition-all duration-300 group-hover:w-6 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
      </button>

      {/* Navigation Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[149] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Navigation Menu Panel */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-80 bg-gradient-to-b from-[#710000] via-[#1a1a1a] to-black z-[150] transition-transform duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full relative">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            {navLabels.home}
          </Link>
          <Link
            href="/projects"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/projects') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            {navLabels.projects}
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/services') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            {navLabels.services}
          </Link>
          <Link
            href="/clients"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/clients') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            {navLabels.clients}
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/about') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            {navLabels.about}
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/contact') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            {navLabels.contact}
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header