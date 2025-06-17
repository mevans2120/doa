import Link from 'next/link'

const Header = () => {
  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-gradient-to-r from-black via-doa-light-gray to-black border-b-4 border-doa-pink torn-edge relative z-10">
      {/* Grunge overlay */}
      <div className="absolute inset-0 grunge-bg opacity-50"></div>
      
      {/* Logo with punk styling */}
      <div className="relative z-20 w-48 h-12 bg-gradient-to-r from-doa-pink to-doa-accent text-black flex items-center justify-center font-bold jagged-border skull-icon">
        <span className="font-['Creepster'] text-lg tracking-wider">💀 DOA 💀</span>
      </div>
      
      {/* Navigation links with punk styling */}
      <div className="flex gap-8 relative z-20">
        <Link
          href="#"
          className="py-3 px-2 border-b-3 border-transparent text-doa-pink font-bold font-['Metal_Mania'] text-lg uppercase tracking-wide hover:border-doa-neon hover:text-doa-neon hover:animate-pulse transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] distressed"
          data-text="PROJECTS"
        >
          PROJECTS
        </Link>
        <Link
          href="#"
          className="py-3 px-2 border-b-3 border-transparent text-doa-pink font-bold font-['Metal_Mania'] text-lg uppercase tracking-wide hover:border-doa-neon hover:text-doa-neon hover:animate-pulse transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] distressed"
          data-text="DESTROY & BUILD"
        >
          DESTROY & BUILD
        </Link>
        <Link
          href="#"
          className="py-3 px-2 border-b-3 border-transparent text-doa-pink font-bold font-['Metal_Mania'] text-lg uppercase tracking-wide hover:border-doa-neon hover:text-doa-neon hover:animate-pulse transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] distressed"
          data-text="THE SCENE"
        >
          THE SCENE
        </Link>
        <Link
          href="#"
          className="py-3 px-2 border-b-3 border-transparent text-doa-pink font-bold font-['Metal_Mania'] text-lg uppercase tracking-wide hover:border-doa-neon hover:text-doa-neon hover:animate-pulse transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] distressed"
          data-text="ABOUT"
        >
          ABOUT
        </Link>
        <Link
          href="#"
          className="py-3 px-2 border-b-3 border-transparent text-doa-pink font-bold font-['Metal_Mania'] text-lg uppercase tracking-wide hover:border-doa-neon hover:text-doa-neon hover:animate-pulse transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] distressed"
          data-text="CONTACT"
        >
          CONTACT
        </Link>
      </div>
      
      {/* Punk divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 punk-divider"></div>
    </nav>
  )
}

export default Header