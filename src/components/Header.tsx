'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // Close menu on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }
    
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEsc)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-10 py-2 md:py-3 bg-gradient-to-r from-[#710000] via-[#252525] to-black bg-[length:200%_100%] animate-gradient-x backdrop-blur-sm border-b border-gray-800 z-50 noise-overlay">
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

        {/* Hamburger menu button - Now visible on all screen sizes */}
        <button
          onClick={toggleMenu}
          className="relative z-50 w-8 h-8 flex flex-col justify-center items-center group"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 group-hover:w-6 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white my-0.5 transition-all duration-300 group-hover:w-6 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 group-hover:w-6 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
        </button>
      </nav>

      {/* Navigation Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />
      
      {/* Navigation Menu Panel */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-80 bg-gradient-to-b from-[#710000] via-[#1a1a1a] to-black z-40 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            Home
          </Link>
          <Link
            href="/projects"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/projects') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            Projects
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/services') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            Services
          </Link>
          <Link
            href="/clients"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/clients') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            Clients
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/about') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className={`py-4 px-6 text-white heading-font text-lg uppercase tracking-wide transition-all duration-300 ${
              isActive('/contact') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header