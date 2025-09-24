import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: () => true,
      initialValue: 'Services Page',
    }),

    // Page Title
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      description: 'The title displayed at the top of the services page',
      initialValue: 'Our Services',
      validation: (Rule) => Rule.required(),
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
          initialValue: 'Services | Department of Art',
        }),
        defineField({
          name: 'metaDescription',
          title: 'SEO Page Description',
          type: 'text',
          rows: 3,
          description: 'Description for search engines (recommended: 150-160 characters)',
          initialValue: 'Explore our comprehensive production services including set construction, scenic painting, prop fabrication, and more. Professional production solutions in Portland, Oregon.',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Services Page',
        subtitle: 'Manage services page content',
      }
    },
  },
})