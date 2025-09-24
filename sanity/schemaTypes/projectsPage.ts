import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: () => true,
      initialValue: 'Projects Page',
    }),

    // Page Title
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      description: 'The title displayed at the top of the projects page',
      initialValue: 'Our Work',
      validation: (Rule) => Rule.required(),
    }),

    // Page Description/Subcopy
    defineField({
      name: 'pageDescription',
      title: 'Page Description',
      type: 'text',
      rows: 3,
      description: 'Brief description or subcopy displayed below the page title',
      initialValue: 'Explore our portfolio of creative productions and collaborations.',
    }),

    // SEO Settings
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'SEO Page Title',
          type: 'string',
          description: 'Title for search engines and browser tabs',
          initialValue: 'Projects | Department of Art',
        }),
        defineField({
          name: 'metaDescription',
          title: 'SEO Page Description',
          type: 'text',
          rows: 3,
          description: 'Description for search engines (recommended: 150-160 characters)',
          initialValue: 'Browse our portfolio of production projects including set construction, scenic painting, and prop fabrication. Department of Art - Portland, Oregon.',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Projects Page',
        subtitle: 'Manage projects page content',
      }
    },
  },
})