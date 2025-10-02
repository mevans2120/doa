'use client'

import Image from 'next/image'
import { urlFor } from '../../../sanity/lib/image'

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  mainImage?: { _type: string; asset: { _ref: string; _type: string } };
  gallery?: Array<{ _type: string; asset: { _ref: string; _type: string }; _key?: string }>;
  client?: string;
  year?: number;
}

interface MinimalVersionProps {
  pageTitle: string;
  pageDescription: string;
  projects: ProjectData[];
}

const MinimalVersion = ({ pageTitle, pageDescription, projects }: MinimalVersionProps) => {
  const getImageUrl = (image: { _type: string; asset: { _ref: string; _type: string } } | undefined, width = 1200) => {
    if (!image) return '/placeholder.jpg'
    try {
      return urlFor(image).width(width).url()
    } catch {
      return '/placeholder.jpg'
    }
  }

  return (
    <div className="py-32 px-4 max-w-[1400px] mx-auto">
      {/* Version Label */}
      <div className="mb-16 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Version 1</span>
        <h2 className="text-lg font-light mt-2 text-gray-400">Minimal</h2>
      </div>

      {/* Header - Minimal Typography */}
      <div className="text-center mb-32 max-w-2xl mx-auto">
        <h1 className="text-5xl font-light tracking-tight mb-6 text-white">
          {pageTitle}
        </h1>
        <p className="text-base font-light text-gray-400 leading-relaxed">
          {pageDescription}
        </p>
      </div>

      {/* Projects - Maximum Whitespace, Minimal Styling */}
      {projects.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-gray-500 font-light">No projects available.</p>
        </div>
      ) : (
        <div className="space-y-48">
          {projects.map((project, projectIndex) => {
            const allImages = [
              ...(project.mainImage ? [project.mainImage] : []),
              ...(project.gallery || [])
            ]

            return (
              <article key={project._id} className="space-y-12">
                {/* Project Header */}
                <div className="max-w-3xl">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-xs text-gray-600 font-mono">
                      {String(projectIndex + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-3xl font-light tracking-tight text-white">
                      {project.title}
                    </h3>
                  </div>
                  {project.description && (
                    <p className="text-base font-light text-gray-400 leading-relaxed pl-8">
                      {project.description}
                    </p>
                  )}
                </div>

                {/* All Images - Single Column, Generous Spacing */}
                <div className="space-y-16">
                  {allImages.map((image, imageIndex) => (
                    <div
                      key={imageIndex}
                      className="relative w-full"
                      style={{
                        maxWidth: imageIndex % 3 === 0 ? '100%' : imageIndex % 3 === 1 ? '85%' : '70%',
                        marginLeft: imageIndex % 3 === 0 ? '0' : imageIndex % 3 === 1 ? 'auto' : '15%',
                        marginRight: imageIndex % 3 === 0 ? '0' : imageIndex % 3 === 1 ? '0' : 'auto',
                      }}
                    >
                      <div className="relative aspect-[4/3] bg-zinc-900">
                        <Image
                          src={getImageUrl(image, 1600)}
                          alt={`${project.title} - Image ${imageIndex + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1400px) 85vw, 1400px"
                        />
                      </div>
                      {/* Optional: Image caption */}
                      <div className="mt-3 text-xs text-gray-600 font-mono">
                        {imageIndex + 1} / {allImages.length}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MinimalVersion
