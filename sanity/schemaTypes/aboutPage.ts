import { defineType, defineField } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short description under the title',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main headline (e.g., "Portland\'s film & photo beating heart")',
    }),
    defineField({
      name: 'companyOverview',
      title: 'Company Overview',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Main company description',
    }),
    defineField({
      name: 'companyImage',
      title: 'Company Image',
      type: 'responsiveImage',
      description: 'Will be displayed in landscape (16:9) format',
    }),
    defineField({
      name: 'missionTitle',
      title: 'Mission Section Title',
      type: 'string',
    }),
    defineField({
      name: 'missionText',
      title: 'Mission Text',
      type: 'text',
    }),
    defineField({
      name: 'visionTitle',
      title: 'Vision Section Title',
      type: 'string',
    }),
    defineField({
      name: 'visionText',
      title: 'Vision Text',
      type: 'text',
    }),
    defineField({
      name: 'storyTitle',
      title: 'Our Story Title',
      type: 'string',
    }),
    defineField({
      name: 'storyContent',
      title: 'Our Story Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'storyImage',
      title: 'Story Section Image',
      type: 'responsiveImage',
      description: 'Will be displayed in landscape (16:9) format',
    }),
    defineField({
      name: 'teamSectionTitle',
      title: 'Team Section Title',
      type: 'string',
      initialValue: 'The Team Behind DOA',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'About Page',
        subtitle: 'Page Content',
      }
    },
  },
})