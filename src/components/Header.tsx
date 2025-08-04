import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-black border-b border-gray-800 relative z-10">
      {/* Logo */}
      <div className="relative z-20 flex items-center">
        <Image
          src="/doa-logo.png"
          alt="Department of Art"
          width={120}
          height={120}
          className="mr-4 brightness-0 invert"
        />
      
      </div>
      
      {/* Navigation links */}
      <div className="flex gap-8 relative z-20">
        <Link
          href="/"
          className="py-2 px-4 text-white heading-font text-sm uppercase tracking-wide hover:text-doa-gold transition-all duration-300 border-b-2 border-transparent hover:border-doa-gold"
        >
          Home
        </Link>
        <Link
          href="/projects"
          className="py-2 px-4 text-white heading-font text-sm uppercase tracking-wide hover:text-doa-gold transition-all duration-300 border-b-2 border-transparent hover:border-doa-gold"
        >
          Projects
        </Link>
        <Link
          href="/services"
          className="py-2 px-4 text-white heading-font text-sm uppercase tracking-wide hover:text-doa-gold transition-all duration-300 border-b-2 border-transparent hover:border-doa-gold"
        >
          Services
        </Link>
        <Link
          href="/clients"
          className="py-2 px-4 text-white heading-font text-sm uppercase tracking-wide hover:text-doa-gold transition-all duration-300 border-b-2 border-transparent hover:border-doa-gold"
        >
          Clients
        </Link>
        <Link
          href="/about"
          className="py-2 px-4 text-white heading-font text-sm uppercase tracking-wide hover:text-doa-gold transition-all duration-300 border-b-2 border-transparent hover:border-doa-gold"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="py-2 px-4 text-white heading-font text-sm uppercase tracking-wide hover:text-doa-gold transition-all duration-300 border-b-2 border-transparent hover:border-doa-gold"
        >
          Contact
        </Link>
      </div>
    </nav>
  )
}

export default Header