'use client'

import ProjectsGrid from '@/components/ProjectsGrid'
import ProjectModal from '@/components/ProjectModal'
import { useProjectModal, type ProjectData } from '@/hooks/useProjectModal'

interface ProjectsClientProps {
  pageTitle: string
  pageDescription: string
  projects: ProjectData[]
}

const ProjectsClient = ({ pageTitle, pageDescription, projects }: ProjectsClientProps) => {
  const modal = useProjectModal()

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="text-center mb-12 fade-in-up">
          <h1 className="page-title">{pageTitle}</h1>
          <div className="text-xl heading-font text-gray-300 mb-8">
            {pageDescription}
          </div>
          <div className="professional-divider max-w-md mx-auto"></div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects available.</p>
          </div>
        ) : (
          <ProjectsGrid
            projects={projects}
            onProjectClick={modal.openModal}
            showViewAllCTA={false}
          />
        )}
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
    </div>
  )
}

export default ProjectsClient