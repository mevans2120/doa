import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'E.g., Director, Producer, etc.',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this testimonial on the homepage',
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
      title: 'author',
      subtitle: 'company',
    },
  },
})