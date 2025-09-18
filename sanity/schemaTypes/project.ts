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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Film Production', value: 'Film Production'},
          {title: 'Television Series', value: 'Television Series'},
          {title: 'Commercial Production', value: 'Commercial Production'},
          {title: 'Live Events', value: 'Live Events'},
          {title: 'Music Video', value: 'Music Video'},
          {title: 'Other', value: 'Other'},
        ],
      },
    }),
    defineField({
      name: 'type',
      title: 'Project Type',
      type: 'string',
      description: 'E.g., Dystopian Sci-Fi Feature, Business Thriller, etc.',
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
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'object',
      fields: [
        {name: 'director', type: 'string', title: 'Director'},
        {name: 'productionDesigner', type: 'string', title: 'Production Designer'},
        {name: 'cinematographer', type: 'string', title: 'Cinematographer'},
      ],
    }),
    defineField({
      name: 'technicalDetails',
      title: 'Technical Details',
      type: 'object',
      fields: [
        {name: 'squareFeet', type: 'number', title: 'Square Feet'},
        {name: 'buildDuration', type: 'string', title: 'Build Duration'},
        {
          name: 'specialFeatures',
          type: 'array',
          title: 'Special Features',
          of: [{type: 'string'}],
        },
      ],
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