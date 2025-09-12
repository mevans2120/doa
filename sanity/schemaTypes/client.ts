import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Client logo (for light backgrounds)',
    }),
    defineField({
      name: 'logoWhite',
      title: 'Logo (White)',
      type: 'image',
      description: 'White version of logo for dark backgrounds',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this client prominently',
      initialValue: false,
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
      title: 'name',
      media: 'logo',
    },
  },
})