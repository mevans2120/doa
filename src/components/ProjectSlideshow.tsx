'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { getImageSource } from '../../sanity/lib/image'
import type { SanityResponsiveImage } from '@/types/sanity'

interface ProjectSlideshowProps {
  projectTitle: string
  images: SanityResponsiveImage[]
}

/**
 * Calculate the effective aspect ratio of an image accounting for crop data
 *
 * When an image has crop metadata, the displayed aspect ratio differs from
 * the original image dimensions. This function calculates the correct ratio.
 */
function getEffectiveAspectRatio(image: SanityResponsiveImage): number {
  const originalAspectRatio = image.asset?.metadata?.dimensions?.aspectRatio || 16 / 9

  // If no crop data, return original aspect ratio
  if (!image.crop) {
    return originalAspectRatio
  }

  // Crop values are normalized (0-1) representing how much to crop from each edge
  const { top = 0, bottom = 0, left = 0, right = 0 } = image.crop

  // Calculate remaining width and height after cropping
  const remainingWidthRatio = 1 - left - right
  const remainingHeightRatio = 1 - top - bottom

  // Adjust aspect ratio based on crop
  // New aspect ratio = (original width * width ratio) / (original height * height ratio)
  // Which simplifies to: original aspect ratio * (width ratio / height ratio)
  return originalAspectRatio * (remainingWidthRatio / remainingHeightRatio)
}

const ProjectSlideshow = ({ projectTitle, images }: ProjectSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

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
    const aspectRatio = getEffectiveAspectRatio(images[0])

    return (
      <div className="relative rounded-lg overflow-hidden border border-zinc-800 hover:border-gray-400 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(192,192,192,0.3)]">
        <div className="relative bg-black" style={{ aspectRatio }}>
          <Image
            src={getImageSource(images[0])}
            alt={images[0]?.alt || `${projectTitle} - Image`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 1400px"
            priority
            quality={85}
          />
        </div>
      </div>
    )
  }

  // Get aspect ratio of current image for dynamic container sizing
  const currentAspectRatio = getEffectiveAspectRatio(images[currentIndex])

  return (
    <div className="relative group">
      {/* Main Slideshow Container */}
      <div
        className="relative rounded-lg overflow-hidden border border-zinc-800 hover:border-gray-400 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(192,192,192,0.3)]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative bg-black" style={{ aspectRatio: currentAspectRatio }}>
          <Image
            src={getImageSource(images[currentIndex])}
            alt={images[currentIndex]?.alt || `${projectTitle} - Image ${currentIndex + 1}`}
            fill
            className={`object-contain transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 100vw, 1400px"
            priority={currentIndex === 0}
            quality={85}
          />
        </div>

        {/* Invisible Navigation Arrows - Preserve functionality */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-0 w-1/3 h-full opacity-0 cursor-pointer"
          aria-label="Previous image"
        />

        <button
          onClick={goToNext}
          className="absolute right-0 top-0 w-1/3 h-full opacity-0 cursor-pointer"
          aria-label="Next image"
        />
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
          {images.map((image, index) => {
            // Get aspect ratio accounting for crop data
            const aspectRatio = getEffectiveAspectRatio(image)

            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative rounded overflow-hidden border-2 transition-all duration-300 bg-black ${
                  index === currentIndex
                    ? 'border-gray-400 scale-105 shadow-[0_4px_16px_rgba(192,192,192,0.3)]'
                    : 'border-zinc-800 hover:border-gray-600 opacity-60 hover:opacity-100'
                }`}
                style={{ aspectRatio }}
                aria-label={`Thumbnail ${index + 1}`}
              >
                <Image
                  src={getImageSource(image)}
                  alt={image?.alt || `${projectTitle} - Thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="200px"
                  quality={85}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProjectSlideshow
