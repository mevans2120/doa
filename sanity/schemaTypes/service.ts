import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'bodyText',
      description: 'Brief description with optional formatting (max 200 characters total)',
      validation: (Rule) => Rule.required().custom((value) => {
        if (!value) return true
        // Calculate total text length from all blocks
        const textLength = value.reduce((acc: number, block: any) => {
          if (block._type === 'block' && block.children) {
            return acc + block.children.reduce((sum: number, child: any) => {
              return sum + (child.text?.length || 0)
            }, 0)
          }
          return acc
        }, 0)

        return textLength <= 200 || 'Description must be 200 characters or less'
      }),
    }),
    defineField({
      name: 'iconType',
      title: 'Icon Type',
      type: 'string',
      description: 'Choose an icon for this service',
      options: {
        list: [
          { title: 'Brush (Renderings)', value: 'brush' },
          { title: 'Building (Construction)', value: 'building' },
          { title: 'Paint Bucket (Scenic)', value: 'paint' },
          { title: 'Tools (Welding)', value: 'tools' },
          { title: 'Display (Trade Show)', value: 'display' },
          { title: 'Shopping Cart (Retail)', value: 'cart' },
          { title: 'Box (Crating)', value: 'box' },
          { title: 'Truck (Transport)', value: 'truck' },
          { title: 'Users (Crew)', value: 'users' },
          { title: 'Warehouse (Shop)', value: 'warehouse' },
          { title: 'Globe (Internet)', value: 'globe' },
          { title: 'Lightning (FX)', value: 'lightning' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'tools',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order for display (lower numbers appear first)',
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      description: 'Show this service on the homepage',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      featured: 'featured',
    },
    prepare(selection) {
      const { title, order, featured } = selection
      return {
        title: featured ? `⭐ ${order}. ${title}` : `${order}. ${title}`,
        subtitle: featured ? 'Featured' : '',
      }
    },
  },
})