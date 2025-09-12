import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'E.g., Founder & Creative Director',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imdbUrl',
      title: 'IMDb URL',
      type: 'url',
      description: 'Link to IMDb profile',
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
      subtitle: 'role',
      media: 'photo',
    },
  },
})