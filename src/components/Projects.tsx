import ProjectsClient from './ProjectsClient'

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  mainImage?: { _type: string; asset: { _ref: string; _type: string } };
  gallery?: Array<{ _type: string; asset: { _ref: string; _type: string }; _key?: string }>;
  client?: string;
  year?: number;
}

interface ProjectsProps {
  projects: ProjectData[]
  sectionTitle: string
}

export default function Projects({ projects, sectionTitle }: ProjectsProps) {
  return (
    <section className="py-20 bg-doa-black text-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12 fade-in-up">
          {/* LCP element - rendered immediately on server */}
          <h2 className="bebas-font text-6xl text-white mb-6 text-outline">
            {sectionTitle}
          </h2>
        </div>

        <ProjectsClient projects={projects} />
      </div>
    </section>
  )
}
