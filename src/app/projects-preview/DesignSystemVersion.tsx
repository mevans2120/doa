'use client'

import ProjectSlideshow from '@/components/ProjectSlideshow'
import type { SanityResponsiveImage } from '@/types/sanity'

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  mainImage?: SanityResponsiveImage;
  gallery?: Array<SanityResponsiveImage>;
  client?: string;
  year?: number;
}

interface DesignSystemVersionProps {
  pageTitle: string;
  pageDescription: string;
  projects: ProjectData[];
}

const DesignSystemVersion = ({ pageTitle, pageDescription, projects }: DesignSystemVersionProps) => {
  return (
    <div className="py-24 bg-black">
      {/* Header Section - Using existing design system */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16 fade-in-up">
          <h1 className="page-title">{pageTitle}</h1>
          <div className="text-xl heading-font text-gray-300 mb-8">
            {pageDescription}
          </div>
          <div className="professional-divider max-w-md mx-auto"></div>
        </div>

        {/* Projects List - 2 Column Grid on Desktop */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-start">
            {projects.map((project, projectIndex) => {
              const allImages = [
                ...(project.mainImage ? [project.mainImage] : []),
                ...(project.gallery || [])
              ]

              return (
                <article
                  key={project._id}
                  className="fade-in-up flex flex-col"
                  style={{ animationDelay: `${projectIndex * 100}ms` }}
                >
                  {/* Project Header */}
                  <div className="mb-6 lg:min-h-[180px]">
                    <div className="mb-4">
                      <h3 className="heading-font text-3xl font-semibold">{project.title}</h3>
                    </div>
                    {project.description && (
                      <p className="text-gray-300 leading-relaxed text-base">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Project Slideshow */}
                  {allImages.length > 0 && (
                    <ProjectSlideshow
                      projectTitle={project.title}
                      images={allImages}
                    />
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DesignSystemVersion
