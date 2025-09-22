'use client'

import { useEffect, useState, useRef } from 'react'

const PulseDivider = () => {
  const [isVisible, setIsVisible] = useState(false)
  const dividerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    if (dividerRef.current) {
      observer.observe(dividerRef.current)
    }

    return () => {
      if (dividerRef.current) {
        observer.unobserve(dividerRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={dividerRef}
      className="relative w-full h-20 overflow-hidden"
    >
      {/* Left edge vertical strips */}
      <div className={`absolute left-0 top-0 bottom-0 flex gap-2 transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {[...Array(5)].map((_, i) => (
          <div
            key={`left-${i}`}
            className="w-px bg-gradient-to-b from-transparent via-red-600/20 to-transparent"
            style={{
              height: '100%',
              animation: isVisible ? `glowPulse 3s ease-in-out infinite ${i * 0.2}s` : 'none',
              marginLeft: i === 0 ? '10px' : '0'
            }}
          />
        ))}
      </div>

      {/* Right edge vertical strips */}
      <div className={`absolute right-0 top-0 bottom-0 flex gap-2 transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {[...Array(5)].map((_, i) => (
          <div
            key={`right-${i}`}
            className="w-px bg-gradient-to-b from-transparent via-red-600/20 to-transparent"
            style={{
              height: '100%',
              animation: isVisible ? `glowPulse 3s ease-in-out infinite ${(4 - i) * 0.2}s` : 'none',
              marginRight: i === 4 ? '10px' : '0'
            }}
          />
        ))}
      </div>

      {/* Add custom CSS for the glow animation */}
      <style jsx>{`
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.2;
            filter: drop-shadow(0 0 1px rgba(220, 38, 38, 0.3));
          }
          50% {
            opacity: 0.5;
            filter: drop-shadow(0 0 4px rgba(220, 38, 38, 0.6));
          }
        }
      `}</style>
    </div>
  )
}

export default PulseDivider