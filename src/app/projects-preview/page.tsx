import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { client } from '../../../sanity/lib/client'
import { projectsQuery, projectsPageQuery } from '../../../sanity/lib/queries'
import type { Metadata } from 'next'
import DesignSystemVersion from './DesignSystemVersion'

// Revalidate every 5 minutes as fallback (webhooks will trigger instant updates)
export const revalidate = 300

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
    title: pageData?.seo?.metaTitle || pageData?.pageTitle || 'Our Work | Department of Art',
    description: pageData?.seo?.metaDescription || pageData?.pageDescription || 'Showcasing Our Creative Excellence and Technical Expertise',
  }
}

const ProjectsPreviewPage = async () => {
  const { pageData, projects } = await getProjectsData()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen text-white bg-black relative">
        <DesignSystemVersion
          pageTitle={pageData.pageTitle || 'Our Work'}
          pageDescription={pageData.pageDescription || 'Showcasing Our Creative Excellence and Technical Expertise'}
          projects={projects}
        />
      </main>
      <Footer />
    </div>
  )
}

export default ProjectsPreviewPage
