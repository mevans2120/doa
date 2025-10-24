'use client'

import Image from 'next/image'
import { getImageSource } from '../../sanity/lib/image'
import type { ProjectData } from '@/hooks/useProjectModal'

interface ProjectsGridProps {
  projects: ProjectData[]
  onProjectClick: (project: ProjectData) => void
  showViewAllCTA?: boolean
}

const ProjectsGrid = ({ projects, onProjectClick, showViewAllCTA = false }: ProjectsGridProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project._id}
            className="group cursor-pointer relative overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:scale-105 hover:brightness-110 hover:border-gray-400 hover:shadow-[0_8px_32px_rgba(192,192,192,0.3)]"
            onClick={() => onProjectClick(project)}
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              {project.mainImage ? (
                <Image
                  src={getImageSource(project.mainImage)}
                  alt={project.mainImage.alt || project.title}
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
              <h3 className="heading-font text-xl font-semibold">{project.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {showViewAllCTA && (
        <div className="text-center mt-16">
          <a href="/projects" className="view-all-cta">
            View All Projects
          </a>
        </div>
      )}
    </>
  )
}

export default ProjectsGrid
