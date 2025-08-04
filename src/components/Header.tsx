'use client'

import { useState } from 'react'
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

  return (
    <>
      <nav className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 md:py-6 bg-doa-black border-b border-gray-800 relative z-50">
        {/* Logo */}
        <Link href="/" className="relative z-20 flex items-center">
          <Image
            src="/doa-logo.png"
            alt="Department of Art"
            width={100}
            height={100}
            className="brightness-0 invert cursor-pointer"
          />
        </Link>
        
        {/* Desktop Navigation links */}
        <div className="hidden md:flex gap-8 relative z-20">
          
          <Link
            href="/projects"
            className={`py-2 px-4 text-white heading-font text-sm uppercase tracking-wide transition-all duration-300 ${
              isActive('/projects') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            Projects
          </Link>
          <Link
            href="/services"
            className={`py-2 px-4 text-white heading-font text-sm uppercase tracking-wide transition-all duration-300 ${
              isActive('/services') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            Services
          </Link>
          <Link
            href="/clients"
            className={`py-2 px-4 text-white heading-font text-sm uppercase tracking-wide transition-all duration-300 ${
              isActive('/clients') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            Clients
          </Link>
          <Link
            href="/about"
            className={`py-2 px-4 text-white heading-font text-sm uppercase tracking-wide transition-all duration-300 ${
              isActive('/about') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`py-2 px-4 text-white heading-font text-sm uppercase tracking-wide transition-all duration-300 ${
              isActive('/contact') ? '[text-shadow:_0_0_25px_rgba(255,255,255,1)]' : 'hover:[text-shadow:_0_0_25px_rgba(255,255,255,1)]'
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </nav>

      {/* Mobile Navigation Menu - Outside of nav for proper layering */}
      <div className={`fixed inset-0 bg-[#121212] z-40 md:hidden transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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