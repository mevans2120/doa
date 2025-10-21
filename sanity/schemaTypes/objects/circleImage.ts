import {defineType, defineField} from 'sanity'
import {CircleImageInput} from '../components/CircleImageInput'

export default defineType({
  name: 'circleImage',
  title: 'Circle Image',
  type: 'image',
  components: {
    input: CircleImageInput,
  },
  options: {
    hotspot: true,
    accept: 'image/*',
  },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative Text',
      description: 'Important for SEO and accessibility',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      imageUrl: 'asset.url',
      title: 'alt',
    },
    prepare({imageUrl, title}) {
      return {
        title: title || 'Untitled image',
        subtitle: 'Circle Image (displayed as circular)',
        imageUrl,
      }
    },
  },
})
