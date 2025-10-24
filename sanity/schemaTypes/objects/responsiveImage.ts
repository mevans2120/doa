import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'responsiveImage',
  title: 'Responsive Image',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative Text',
      description: 'Important for SEO and accessibility',
    }),
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description: 'Optional caption displayed below the image',
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
        subtitle: 'Image',
        imageUrl,
      }
    },
  },
})
