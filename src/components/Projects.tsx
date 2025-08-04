'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProjectData {
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
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
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const allProjects: ProjectData[] = [
    // Feature Films
    {
      id: 'echoes-tomorrow',
      title: "Echoes of Tomorrow",
      category: "Film Production",
      type: "Dystopian Sci-Fi Feature",
      description: "Transformed 20,000 sq ft warehouse into a sprawling dystopian cityscape featuring practical weather effects, modular building facades, and fully-functional infrastructure. Collaborated with Oscar-nominated production designer Sarah Chen to create a believable post-climate-disaster Portland.",
      imageUrl: "/doa-sample-1.jpeg",
      galleryImages: ["/doa-sample-1.jpeg", "/doa-sample-2.jpeg", "/doa-sample-3.png"],
      client: "Paramount Pictures",
      year: 2024,
      credits: {
        director: "Michael Rodriguez",
        productionDesigner: "Sarah Chen",
        cinematographer: "Lisa Park"
      },
      technicalDetails: {
        squareFeet: 20000,
        buildDuration: "12 weeks",
        specialFeatures: ["Rain towers", "Modular facades", "Practical debris effects"]
      }
    },
    {
      id: 'last-station',
      title: "The Last Station",
      category: "Film Production",
      type: "Post-Apocalyptic Drama",
      description: "Constructed an abandoned subway station complete with decaying infrastructure, atmospheric lighting rigs, and period-accurate signage. The build included functional track sections and a full-scale train car interior designed for 360-degree filming.",
      imageUrl: "/doa-sample-4.png",
      galleryImages: ["/doa-sample-4.png", "/doa-sample-5.jpeg"],
      client: "A24 Films",
      year: 2024,
      technicalDetails: {
        squareFeet: 15000,
        buildDuration: "10 weeks",
        specialFeatures: ["Functional track system", "Atmospheric effects", "Period signage"]
      }
    },
    {
      id: 'neon-nights',
      title: "Neon Nights",
      category: "Film Production",
      type: "Cyberpunk Action",
      description: "Built a three-story cyberpunk marketplace with integrated LED displays, practical neon signage, and modular vendor stalls. Features included rain-slicked surfaces, steam effects, and breakaway elements for stunt sequences.",
      imageUrl: "/doa-sample-6.jpeg",
      galleryImages: ["/doa-sample-6.jpeg", "/doa-sample-7.jpeg"],
      client: "Warner Bros.",
      year: 2023,
      credits: {
        director: "Akira Tanaka",
        productionDesigner: "Marcus Webb"
      },
      technicalDetails: {
        squareFeet: 25000,
        buildDuration: "14 weeks",
        specialFeatures: ["LED integration", "Breakaway elements", "Water effects"]
      }
    },
    {
      id: 'broken-chains',
      title: "Broken Chains",
      category: "Film Production",
      type: "Historical Epic",
      description: "Recreated 1860s plantation grounds including main house facade, slave quarters, and cotton processing facilities. Meticulous historical research ensured authenticity while incorporating modern safety standards and filming requirements.",
      imageUrl: "/doa-sample-8.jpeg",
      galleryImages: ["/doa-sample-8.jpeg", "/doa-sample-9.jpeg"],
      client: "Focus Features",
      year: 2023,
      credits: {
        director: "Angela Washington",
        productionDesigner: "Robert Hayes"
      },
      technicalDetails: {
        squareFeet: 30000,
        buildDuration: "16 weeks",
        specialFeatures: ["Historical accuracy", "Period materials", "Aged finishes"]
      }
    },
    // Television Series
    {
      id: 'corporate-shadows',
      title: "Corporate Shadows",
      category: "Television Series",
      type: "Business Thriller",
      description: "Designed and built a modern corporate headquarters spanning two sound stages. Features include a boardroom with panoramic city views (LED wall integration), executive offices, and a multi-level atrium with practical elevator.",
      imageUrl: "/doa-sample-10.jpeg",
      galleryImages: ["/doa-sample-10.jpeg", "/doa-sample-11.jpeg"],
      client: "HBO",
      year: 2024,
      credits: {
        productionDesigner: "Elena Volkov"
      },
      technicalDetails: {
        squareFeet: 18000,
        buildDuration: "8 weeks",
        specialFeatures: ["LED wall integration", "Practical elevator", "Modular offices"]
      }
    },
    {
      id: 'portland-files',
      title: "Portland Files",
      category: "Television Series",
      type: "Crime Procedural",
      description: "Created a working police precinct including interrogation rooms with two-way mirrors, evidence lockup, and bullpen area. Designed for quick redressing to serve as multiple Portland locations throughout the series.",
      imageUrl: "/doa-sample-12.jpeg",
      galleryImages: ["/doa-sample-12.jpeg", "/doa-sample-13.png"],
      client: "Netflix",
      year: 2023,
      technicalDetails: {
        squareFeet: 12000,
        buildDuration: "6 weeks",
        specialFeatures: ["Two-way mirrors", "Modular design", "Quick-change elements"]
      }
    },
    {
      id: 'workshop-series',
      title: "The Workshop",
      category: "Television Series",
      type: "Artisan Documentary",
      description: "Built multiple artisan workshops including a traditional blacksmith forge, woodworking studio, and glass-blowing facility. Each space was fully functional for on-camera demonstrations while meeting all safety requirements.",
      imageUrl: "/doa-sample-14.jpeg",
      client: "Discovery+",
      year: 2023,
      technicalDetails: {
        squareFeet: 10000,
        buildDuration: "5 weeks",
        specialFeatures: ["Functional workshops", "Safety compliance", "Authentic tools"]
      }
    },
    // Commercial Productions
    {
      id: 'tech-innovation',
      title: "Tech Innovation Campaign",
      category: "Commercial Production",
      type: "Brand Campaign",
      description: "Constructed a futuristic smart home environment featuring hidden automation, seamless surfaces, and integrated projection mapping zones. The modular design allowed for rapid configuration changes between shots.",
      imageUrl: "/doa-sample-15.jpeg",
      galleryImages: ["/doa-sample-15.jpeg", "/doa-sample-16.jpeg"],
      client: "Apple",
      year: 2024,
      technicalDetails: {
        squareFeet: 5000,
        buildDuration: "2 weeks",
        specialFeatures: ["Projection mapping", "Hidden automation", "Modular design"]
      }
    },
    {
      id: 'sustainable-future',
      title: "Sustainable Future",
      category: "Commercial Production",
      type: "Environmental Campaign",
      description: "Created an eco-friendly living space using reclaimed materials and living walls. The build showcased sustainable construction techniques while maintaining high production values for automotive brand sustainability campaign.",
      imageUrl: "/doa-sample-17.jpeg",
      client: "Tesla",
      year: 2023,
      technicalDetails: {
        squareFeet: 3500,
        buildDuration: "10 days",
        specialFeatures: ["Living walls", "Reclaimed materials", "Solar integration"]
      }
    },
    // Live Events
    {
      id: 'fashion-week-2024',
      title: "Portland Fashion Week 2024",
      category: "Live Events",
      type: "Fashion Show",
      description: "Designed and constructed a 120-foot modular runway with integrated lighting and projection mapping capabilities. The design featured a transformable backdrop system allowing for rapid scene changes between shows.",
      imageUrl: "/doa-sample-18.jpeg",
      galleryImages: ["/doa-sample-18.jpeg"],
      client: "Portland Fashion Council",
      year: 2024,
      technicalDetails: {
        squareFeet: 15000,
        buildDuration: "5 days",
        specialFeatures: ["Modular runway", "Projection mapping", "Quick-change backdrops"]
      }
    },
    {
      id: 'tech-summit',
      title: "Northwest Tech Summit",
      category: "Live Events",
      type: "Corporate Conference",
      description: "Built a multi-zone conference environment including main stage, breakout rooms, and interactive demo areas. Featured custom-built tech installations and seamless AV integration throughout.",
      imageUrl: "/doa-sample-16.jpeg",
      client: "Portland Tech Association",
      year: 2023,
      technicalDetails: {
        squareFeet: 25000,
        buildDuration: "1 week",
        specialFeatures: ["Interactive installations", "AV integration", "Modular zones"]
      }
    }
  ]

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
    if (selectedProject?.galleryImages) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedProject.galleryImages!.length
      )
    }
  }

  const prevImage = () => {
    if (selectedProject?.galleryImages) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.galleryImages!.length - 1 : prev - 1
      )
    }
  }

  // Show only 3 featured projects on homepage
  const featuredProjects = allProjects.slice(0, 3)

  return (
    <section id="projects" className="bg-doa-black text-white pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-5xl font-bold mb-12 text-center display-font">Featured Projects</h2>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer relative overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:scale-105 hover:brightness-110 hover:border-gray-400 hover:shadow-[0_8px_32px_rgba(192,192,192,0.3)]"
              onClick={() => openModal(project)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-1">{project.type}</p>
                <p className="text-gray-500 text-sm">{project.client} • {project.year}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-16">
          <a href="/projects" className="view-all-cta">
            View All Projects
          </a>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div 
            className="bg-zinc-900 rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Gallery */}
              <div className="space-y-4">
                {selectedProject.galleryImages && selectedProject.galleryImages.length > 0 && (
                  <div className="relative">
                    <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                      <Image
                        src={selectedProject.galleryImages[currentImageIndex]}
                        alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {selectedProject.galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                )}
                {/* Thumbnail strip */}
                {selectedProject.galleryImages && selectedProject.galleryImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedProject.galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 relative rounded overflow-hidden ${
                          idx === currentImageIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-2">{selectedProject.title}</h3>
                  <p className="text-gray-400">{selectedProject.type} • {selectedProject.year}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Project Overview</h4>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                </div>

                {selectedProject.credits && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Credits</h4>
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
                    <h4 className="text-lg font-semibold mb-2">Technical Details</h4>
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