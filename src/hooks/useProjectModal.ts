import { useState } from 'react'
import type { SanityResponsiveImage, PortableTextBlock } from '@/types/sanity'

export interface ProjectData {
  _id: string
  title: string
  description: string | PortableTextBlock[]
  mainImage?: SanityResponsiveImage
  gallery?: SanityResponsiveImage[]
  client?: string
  year?: number
}

export const useProjectModal = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return {
    selectedProject,
    isModalOpen,
    currentImageIndex,
    openModal,
    closeModal,
    nextImage,
    prevImage,
    selectImage
  }
}
