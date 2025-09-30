import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProjectsClient from './ProjectsClient'
import { client } from '../../../sanity/lib/client'
import { projectsQuery, projectsPageQuery } from '../../../sanity/lib/queries'
import type { Metadata } from 'next'

interface ProjectsPageData {
  pageTitle?: string
  pageDescription?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

async function getProjectsData() {
  try {
    const [pageData, projects] = await Promise.all([
      client.fetch<ProjectsPageData>(projectsPageQuery),
      client.fetch(projectsQuery)
    ])
    return { pageData: pageData || {}, projects }
  } catch (error) {
    console.error('Error fetching projects data:', error)
    return { pageData: {}, projects: [] }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { pageData } = await getProjectsData()

  return {
    title: pageData?.seo?.metaTitle || 'Projects | Department of Art',
    description: pageData?.seo?.metaDescription || 'Browse our portfolio of production projects including set construction, scenic painting, and prop fabrication.',
  }
}

const ProjectsPage = async () => {
  const { pageData, projects } = await getProjectsData()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen text-white bg-black relative">
        <ProjectsClient
          pageTitle={pageData.pageTitle || 'Our Work'}
          pageDescription={pageData.pageDescription || 'Showcasing Our Creative Excellence and Technical Expertise'}
          projects={projects}
        />
      </main>
      <Footer />
    </div>
  )
}

export default ProjectsPage