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
      type: 'bodyText',
      description: 'Team member bio with optional formatting (bold, italic, links)',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'circleImage',
      description: 'Will be displayed as a circle - use the hotspot to position the face/subject in the center',
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