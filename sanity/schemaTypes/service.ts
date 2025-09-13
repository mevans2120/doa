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
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief description for service cards (max 200 characters)',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Detailed service description for individual service pages',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Production Services', value: 'production' },
          { title: 'Design & Visualization', value: 'design' },
          { title: 'Fabrication', value: 'fabrication' },
          { title: 'Rentals', value: 'rentals' },
          { title: 'Specialty Services', value: 'specialty' },
        ],
      },
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
    defineField({
      name: 'gallery',
      title: 'Service Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Images showcasing this service',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      order: 'order',
      featured: 'featured',
    },
    prepare(selection) {
      const { title, subtitle, order, featured } = selection
      return {
        title: `${order}. ${title}`,
        subtitle: `${subtitle || 'Uncategorized'}${featured ? ' • Featured' : ''}`,
      }
    },
  },
})