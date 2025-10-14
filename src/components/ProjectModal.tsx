'use client'

import Image from 'next/image'
import { urlFor, getImageSource } from '../../sanity/lib/image'
import RichText from './RichText'
import type { ProjectData } from '@/hooks/useProjectModal'
import type { PortableTextBlock } from '@/types/sanity'

interface ProjectModalProps {
  project: ProjectData | null
  isOpen: boolean
  onClose: () => void
  currentImageIndex: number
  onNextImage: () => void
  onPrevImage: () => void
  onSelectImage: (index: number) => void
}

const ProjectModal = ({
  project,
  isOpen,
  onClose,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  onSelectImage
}: ProjectModalProps) => {
  if (!isOpen || !project) return null
  // Modal sized at 1440px width and 90vh height

  const getImageUrl = (image: ProjectData['mainImage']) => {
    if (!image) return '/placeholder.jpg'
    try {
      return urlFor(image).width(800).height(600).url()
    } catch {
      return '/placeholder.jpg'
    }
  }

  const isPortableText = (description: string | PortableTextBlock[]): description is PortableTextBlock[] => {
    return Array.isArray(description)
  }

  return (
    <div
      className="fixed inset-0 bg-doa-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-lg max-w-[1440px] max-h-[90vh] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-10 text-white hover:text-gray-300 bg-doa-black/50 rounded-full p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-12 px-6 pb-6 md:p-6 overflow-y-auto">
          {/* Gallery */}
          <div className="space-y-4">
            {project.gallery && project.gallery.length > 0 ? (
              <div className="relative">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-black">
                  <Image
                    src={getImageSource(project.gallery[currentImageIndex])}
                    alt={project.gallery[currentImageIndex]?.alt || `${project.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {project.gallery.length > 1 && (
                  <>
                    <button
                      onClick={onPrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-doa-black/50 hover:bg-doa-black/70 text-white p-2 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={onNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-doa-black/50 hover:bg-doa-black/70 text-white p-2 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ) : project.mainImage ? (
              <div className="aspect-video relative rounded-lg overflow-hidden bg-black">
                <Image
                  src={getImageSource(project.mainImage)}
                  alt={project.mainImage.alt || project.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : null}

            {/* Thumbnail strip - keep cropped for consistency */}
            {project.gallery && project.gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {project.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 relative rounded overflow-hidden ${
                      idx === currentImageIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={getImageUrl(img)}
                      alt={img.alt || `Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="heading-font text-3xl font-bold mb-4">{project.title}</h3>
            </div>

            <div>
              {isPortableText(project.description) ? (
                <RichText value={project.description} />
              ) : (
                <p className="text-gray-300 leading-relaxed">{project.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
