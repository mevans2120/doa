'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { client } from '../../sanity/lib/client'
import { urlFor } from '../../sanity/lib/image'
import { featuredProjectsQuery } from '../../sanity/lib/queries'
import { useHomepage } from '@/contexts/HomepageContext'

interface ProjectData {
  _id: string;
  title: string;
  slug?: { current: string };
  category: string;
  type: string;
  description: string;
  mainImage?: { _type: string; asset: { _ref: string; _type: string } };
  gallery?: Array<{ _type: string; asset: { _ref: string; _type: string }; _key?: string }>;
  client?: string;
  year?: number;
  credits?: {
    director?: string;
    productionDesigner?: string;
    cinematographer?: string;
  };
  technicalDetails?: {
    squareFeet?: number;
    buildDuration?: string;
    specialFeatures?: string[];
  };
}

const Projects = () => {
  const { settings } = useHomepage()
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  
  const sectionTitle = settings.sectionTitles?.featuredProjects || 'FEATURED PROJECTS'

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await client.fetch<ProjectData[]>(featuredProjectsQuery)
        setProjects(data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Fallback to empty array if fetch fails
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const openModal = (project: ProjectData) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedProject?.gallery && selectedProject.gallery.length > 0) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedProject.gallery!.length
      )
    }
  }

  const prevImage = () => {
    if (selectedProject?.gallery && selectedProject.gallery.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.gallery!.length - 1 : prev - 1
      )
    }
  }

  const getImageUrl = (image: { _type: string; asset: { _ref: string; _type: string } } | undefined) => {
    if (!image) return '/placeholder.jpg'
    try {
      return urlFor(image).width(800).height(600).url()
    } catch {
      return '/placeholder.jpg'
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-doa-black text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="bebas-font text-6xl text-white mb-6 text-outline">{sectionTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-zinc-900 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section className="py-20 bg-doa-black text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="bebas-font text-6xl text-white mb-6 text-outline">{sectionTitle}</h2>
          </div>
          <p className="text-gray-400">No projects available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-doa-black text-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="bebas-font text-6xl text-white mb-6 text-outline">FEATURED PROJECTS</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group cursor-pointer relative overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:scale-105 hover:brightness-110 hover:border-gray-400 hover:shadow-[0_8px_32px_rgba(192,192,192,0.3)]"
              onClick={() => openModal(project)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                {project.mainImage ? (
                  <Image
                    src={getImageUrl(project.mainImage)}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-gray-600">No image available</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-doa-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="heading-font text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-1">{project.type}</p>
                <p className="text-gray-500 text-sm">{project.client} • {project.year}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <a href="/projects" className="view-all-cta">
            View All Projects
          </a>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-doa-black/90 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div 
            className="bg-zinc-900 rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-doa-black/50 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Gallery */}
              <div className="space-y-4">
                {selectedProject.gallery && selectedProject.gallery.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(selectedProject.gallery[currentImageIndex])}
                        alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {selectedProject.gallery.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-doa-black/50 hover:bg-doa-black/70 text-white p-2 rounded-full"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-doa-black/50 hover:bg-doa-black/70 text-white p-2 rounded-full"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                ) : selectedProject.mainImage ? (
                  <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(selectedProject.mainImage)}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
                
                {/* Thumbnail strip */}
                {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedProject.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 relative rounded overflow-hidden ${
                          idx === currentImageIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={getImageUrl(img)}
                          alt={`Thumbnail ${idx + 1}`}
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
                  <h3 className="heading-font text-3xl font-bold mb-2">{selectedProject.title}</h3>
                  <p className="text-gray-400">{selectedProject.type} • {selectedProject.year}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2 heading-font">Project Overview</h4>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                </div>

                {selectedProject.credits && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2 heading-font">Credits</h4>
                    <div className="space-y-1 text-gray-300">
                      {selectedProject.credits.director && (
                        <p><span className="text-gray-500">Director:</span> {selectedProject.credits.director}</p>
                      )}
                      {selectedProject.credits.productionDesigner && (
                        <p><span className="text-gray-500">Production Designer:</span> {selectedProject.credits.productionDesigner}</p>
                      )}
                      {selectedProject.credits.cinematographer && (
                        <p><span className="text-gray-500">Cinematographer:</span> {selectedProject.credits.cinematographer}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedProject.technicalDetails && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2 heading-font">Technical Details</h4>
                    <div className="space-y-1 text-gray-300">
                      {selectedProject.technicalDetails.squareFeet && (
                        <p><span className="text-gray-500">Square Footage:</span> {selectedProject.technicalDetails.squareFeet.toLocaleString()} sq ft</p>
                      )}
                      {selectedProject.technicalDetails.buildDuration && (
                        <p><span className="text-gray-500">Build Duration:</span> {selectedProject.technicalDetails.buildDuration}</p>
                      )}
                      {selectedProject.technicalDetails.specialFeatures && (
                        <div>
                          <span className="text-gray-500">Special Features:</span>
                          <ul className="list-disc list-inside mt-1 ml-4">
                            {selectedProject.technicalDetails.specialFeatures.map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Projects