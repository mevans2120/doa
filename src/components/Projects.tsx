'use client'

import { useState } from 'react'

interface ProjectData {
  title: string;
  category: string;
  type: string;
  description: string;
}

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const projects: ProjectData[] = [
    {
      title: "Dystopian Drama",
      category: "Film Production",
      type: "Feature Film",
      description: "Post-apocalyptic environments crafted with meticulous attention to atmospheric detail and narrative authenticity."
    },
    {
      title: "Corporate Thriller",
      category: "Television Series",
      type: "TV Drama",
      description: "Modern office environments and urban landscapes designed to enhance psychological tension and character development."
    },
    {
      title: "Historical Epic",
      category: "Film Production",
      type: "Period Drama",
      description: "Authentic period recreations combining traditional craftsmanship with modern construction techniques."
    },
    {
      title: "Tech Commercial",
      category: "Commercial Production",
      type: "Brand Campaign",
      description: "Sleek, futuristic environments designed to showcase cutting-edge technology and innovation."
    }
  ]

  const openModal = (project: ProjectData) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <>
      <section className="py-24 px-10 bg-gray-50 relative overflow-hidden" id="projects" role="region">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white"></div>
        
        {/* Section title */}
        <div className="relative z-10 text-center mb-20 fade-in-up">
          <h2 className="text-5xl font-bold heading-font text-black mb-6">
            Featured Projects
          </h2>
          <div className="text-xl heading-font text-gray-600 mb-8">
            Recent Work & Creative Collaborations
          </div>
          <div className="professional-divider max-w-md mx-auto"></div>
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto relative z-10" data-testid="projects-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              className="professional-card transform transition-all duration-300 relative overflow-hidden group cursor-pointer rounded-lg"
              onClick={() => openModal(project)}
            >
              {/* Image wireframe */}
              <div className="w-full h-48 image-wireframe mb-4 rounded-t-lg">
                <span className="text-xs">Project Image</span>
              </div>
              
              <div className="p-6 relative">
                {/* Project title - always visible */}
                <h3 className="text-xl heading-font text-black font-semibold mb-2">
                  {project.title}
                </h3>
                
                {/* Minimal See More indicator - slides up from bottom and covers title */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white to-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-center justify-center">
                  <span className="text-xs heading-font text-doa-gold uppercase tracking-wide">
                    See More
                  </span>
                </div>
              </div>
              
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-doa-gold"></div>
            </div>
          ))}
        </div>
        
        {/* View All CTA */}
        <div className="text-center mt-16 relative z-10">
          <a href="/projects" className="view-all-cta">
            View All Projects
          </a>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl heading-font text-black font-semibold">
                {selectedProject.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal content */}
            <div className="p-6">
              {/* Project image placeholder */}
              <div className="w-full h-64 image-wireframe mb-6 rounded">
                <span className="text-sm">Project Image</span>
              </div>
              
              {/* Project metadata */}
              <div className="mb-4">
                <div className="text-xs heading-font text-doa-gold uppercase tracking-wide mb-2 border border-doa-gold/30 px-3 py-1 inline-block rounded">
                  {selectedProject.category}
                </div>
                <div className="text-sm heading-font text-doa-gold mb-4">
                  {selectedProject.type}
                </div>
              </div>
              
              {/* Project description */}
              <p className="text-gray-600 body-font leading-relaxed mb-6">
                {selectedProject.description}
              </p>
              
              {/* Additional project details could go here */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg heading-font text-black font-semibold mb-3">
                  Project Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Category:</span>
                    <span className="ml-2 text-gray-600">{selectedProject.category}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Type:</span>
                    <span className="ml-2 text-gray-600">{selectedProject.type}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-doa-gold text-black heading-font text-sm uppercase tracking-wide hover:bg-opacity-90 transition-all duration-300 rounded">
                  View Full Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Projects