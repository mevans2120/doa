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
      name: 'type',
      title: 'Type',
      type: 'string',
      description: 'Is this a client or collaborator?',
      options: {
        list: [
          { title: 'Client', value: 'client' },
          { title: 'Collaborator', value: 'collaborator' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'client',
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
      title: 'Featured on Clients Page',
      type: 'boolean',
      description: 'Show this client prominently on the clients page',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOnHomepage',
      title: 'Featured on Homepage',
      type: 'boolean',
      description: 'Show this client on the homepage',
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
      type: 'type',
      featured: 'featured',
      featuredOnHomepage: 'featuredOnHomepage',
      website: 'website',
    },
    prepare(selection) {
      const {title, type, featured, featuredOnHomepage, website} = selection
      const badges = []
      if (featuredOnHomepage) badges.push('🏠')
      if (featured) badges.push('⭐')
      const typeLabel = type === 'collaborator' ? 'Collaborator' : 'Client'
      
      return {
        ...selection,
        title: `${badges.join(' ')} ${title}`.trim(),
        subtitle: `${typeLabel}${website ? ` • ${website}` : ''}`,
      }
    },
  },
})