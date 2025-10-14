'use client'

import { useState, useEffect } from 'react'
import { client } from '../../sanity/lib/client'
import { featuredProjectsQuery } from '../../sanity/lib/queries'
import { useHomepage } from '@/contexts/HomepageContext'
import ProjectsGrid from './ProjectsGrid'
import ProjectModal from './ProjectModal'
import { useProjectModal, type ProjectData } from '@/hooks/useProjectModal'

const Projects = () => {
  const { settings } = useHomepage()
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const modal = useProjectModal()

  const sectionTitle = settings.sectionTitles?.featuredProjects || ''

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await client.fetch<ProjectData[]>(featuredProjectsQuery)
        setProjects(data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

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
          <h2 className="bebas-font text-6xl text-white mb-6 text-outline">{sectionTitle}</h2>
        </div>

        <ProjectsGrid
          projects={projects}
          onProjectClick={modal.openModal}
          showViewAllCTA={true}
        />
      </div>

      <ProjectModal
        project={modal.selectedProject}
        isOpen={modal.isModalOpen}
        onClose={modal.closeModal}
        currentImageIndex={modal.currentImageIndex}
        onNextImage={modal.nextImage}
        onPrevImage={modal.prevImage}
        onSelectImage={modal.selectImage}
      />
    </section>
  )
}

export default Projects