import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this project on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'responsiveImage',
      description: 'Will be displayed in landscape (16:9) on project pages',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [{type: 'responsiveImage'}],
      description: 'Gallery images can be mixed landscape and portrait',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'bodyText',
      description: 'Project overview with optional formatting (bold, italic, links)',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order for display (lower numbers appear first)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      media: 'mainImage',
      featured: 'featured',
    },
    prepare(selection) {
      const {title, client, featured} = selection
      return {
        ...selection,
        title: featured ? `⭐ ${title}` : title,
        subtitle: client ? `${client}${featured ? ' • Featured' : ''}` : (featured ? 'Featured' : ''),
      }
    },
  },
})