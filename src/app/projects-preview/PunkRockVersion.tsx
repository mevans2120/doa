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

interface PunkRockVersionProps {
  pageTitle: string;
  pageDescription: string;
  projects: ProjectData[];
}

const PunkRockVersion = ({ pageTitle, pageDescription, projects }: PunkRockVersionProps) => {
  const getImageUrl = (image: { _type: string; asset: { _ref: string; _type: string } } | undefined, width = 1200) => {
    if (!image) return '/placeholder.jpg'
    try {
      return urlFor(image).width(width).url()
    } catch {
      return '/placeholder.jpg'
    }
  }

  // Punk rock colors
  const accentColors = [
    'border-red-500',
    'border-yellow-400',
    'border-green-500',
    'border-purple-500',
    'border-pink-500',
    'border-cyan-500',
  ]

  const rotations = [-2, 1, -1, 2, -3, 1.5, -1.5, 0.5]

  return (
    <div className="py-24 px-4 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Grungy background texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Version Label */}
      <div className="mb-12 text-center relative z-10">
        <span className="text-xs uppercase tracking-[0.3em] text-red-500 font-bold">Version 2</span>
        <h2 className="text-2xl font-black mt-2 text-white transform -rotate-1">PUNK ROCK</h2>
      </div>

      {/* Header - Bold & Aggressive */}
      <div className="text-center mb-20 max-w-4xl mx-auto relative z-10">
        <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter mb-6 relative inline-block">
          <span className="text-white relative z-10">{pageTitle}</span>
          <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-yellow-400 -z-10 transform -rotate-1" />
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-black transform -translate-y-1/2" />
        </h1>
        <p className="text-xl font-bold uppercase text-yellow-400 tracking-wide mt-8">
          {pageDescription}
        </p>
      </div>

      {/* Projects - Chaotic, Overlapping, High Energy */}
      {projects.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-red-500 font-black text-2xl uppercase">No projects available.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto relative">
          {projects.map((project, projectIndex) => {
            const allImages = [
              ...(project.mainImage ? [project.mainImage] : []),
              ...(project.gallery || [])
            ]

            return (
              <div
                key={project._id}
                className="mb-32 relative"
              >
                {/* Project Header - Graffiti Style */}
                <div className="mb-12 relative">
                  <div className="inline-block transform hover:scale-105 transition-transform">
                    <h3 className="text-5xl md:text-6xl font-black uppercase text-white relative inline-block px-6 py-3">
                      <span className="relative z-10">{project.title}</span>
                      <div
                        className={`absolute inset-0 ${accentColors[projectIndex % accentColors.length]} border-4 transform ${projectIndex % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                      />
                    </h3>
                  </div>
                  {project.description && (
                    <div className="mt-6 max-w-2xl">
                      <p className="text-lg text-gray-300 font-bold uppercase tracking-wide px-4 py-2 bg-black/50 inline-block border-l-4 border-yellow-400">
                        {project.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Images Grid - Chaotic & Overlapping */}
                <div className="grid grid-cols-12 gap-4 relative">
                  {allImages.map((image, imageIndex) => {
                    // Create varied layouts
                    const layouts = [
                      { col: 'col-span-8', row: 'row-span-2' },
                      { col: 'col-span-4', row: 'row-span-1' },
                      { col: 'col-span-6', row: 'row-span-1' },
                      { col: 'col-span-6', row: 'row-span-2' },
                      { col: 'col-span-5', row: 'row-span-1' },
                      { col: 'col-span-7', row: 'row-span-1' },
                    ]
                    const layout = layouts[imageIndex % layouts.length]
                    const rotation = rotations[imageIndex % rotations.length]
                    const color = accentColors[imageIndex % accentColors.length]

                    return (
                      <div
                        key={imageIndex}
                        className={`${layout.col} ${layout.row} relative group`}
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        <div
                          className={`relative w-full h-full border-4 ${color} hover:border-8 transition-all hover:scale-105 hover:z-20 bg-black`}
                          style={{ minHeight: '300px' }}
                        >
                          <Image
                            src={getImageUrl(image, 1200)}
                            alt={`${project.title} - Image ${imageIndex + 1}`}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          {/* Stamp overlay */}
                          <div className="absolute top-4 right-4 bg-red-500 text-white font-black uppercase text-xs px-3 py-1 transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity">
                            {imageIndex + 1}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Divider - Ripped Paper Effect */}
                <div className="mt-20 relative h-12">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom grunge element */}
      <div className="mt-20 text-center">
        <div className="inline-block transform -rotate-2 border-4 border-white px-8 py-4">
          <p className="text-white font-black uppercase text-2xl tracking-wider">
            End of Projects
          </p>
        </div>
      </div>
    </div>
  )
}

export default PunkRockVersion
