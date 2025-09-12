import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      description: 'For SEO purposes',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main headline on homepage',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      description: 'Subheading on homepage',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'email',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        {name: 'instagram', type: 'url', title: 'Instagram'},
        {name: 'linkedin', type: 'url', title: 'LinkedIn'},
        {name: 'vimeo', type: 'url', title: 'Vimeo'},
        {name: 'facebook', type: 'url', title: 'Facebook'},
        {name: 'twitter', type: 'url', title: 'Twitter'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})