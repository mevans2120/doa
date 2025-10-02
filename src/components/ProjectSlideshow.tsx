'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { urlFor } from '../../sanity/lib/image'

interface ImageType {
  _type: string
  asset: { _ref: string; _type: string }
  _key?: string
}

interface ProjectSlideshowProps {
  projectTitle: string
  images: ImageType[]
}

const ProjectSlideshow = ({ projectTitle, images }: ProjectSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const getImageUrl = (image: ImageType, width = 1600) => {
    if (!image) return '/placeholder.jpg'
    try {
      return urlFor(image).width(width).url()
    } catch {
      return '/placeholder.jpg'
    }
  }

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [isTransitioning])

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    goToSlide(newIndex)
  }, [currentIndex, images.length, goToSlide])

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    goToSlide(newIndex)
  }, [currentIndex, images.length, goToSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext])

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) goToNext()
    if (isRightSwipe) goToPrevious()
  }

  if (images.length === 0) return null

  // Single image - no slideshow needed
  if (images.length === 1) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-zinc-800 hover:border-gray-400 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(192,192,192,0.3)]">
        <div className="aspect-[16/9] relative">
          <Image
            src={getImageUrl(images[0], 1600)}
            alt={`${projectTitle} - Image`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1400px"
            priority
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Main Slideshow Container */}
      <div
        className="relative rounded-lg overflow-hidden border border-zinc-800 hover:border-gray-400 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(192,192,192,0.3)]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="aspect-[16/9] relative">
          <Image
            src={getImageUrl(images[currentIndex], 1600)}
            alt={`${projectTitle} - Image ${currentIndex + 1}`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 100vw, 1400px"
            priority={currentIndex === 0}
          />
        </div>

      </div>

      {/* Dot Indicators - Bottom Center */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black ${
              index === currentIndex
                ? 'w-8 h-2 bg-gray-400'
                : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label={`Go to image ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>

      {/* Thumbnail Preview - Shows on larger screens for all projects with multiple images */}
      {images.length > 1 && (
        <div className="hidden lg:grid grid-cols-6 gap-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative aspect-video rounded overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-gray-400 scale-105 shadow-[0_4px_16px_rgba(192,192,192,0.3)]'
                  : 'border-zinc-800 hover:border-gray-600 opacity-60 hover:opacity-100'
              }`}
              aria-label={`Thumbnail ${index + 1}`}
            >
              <Image
                src={getImageUrl(image, 200)}
                alt={`${projectTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="200px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectSlideshow
