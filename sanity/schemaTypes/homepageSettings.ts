import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'This is just for internal reference',
      initialValue: 'Homepage Settings',
      readOnly: true,
    }),
    
    // Hero Section
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'mainTitle',
          title: 'Main Title',
          type: 'string',
          description: 'The main DOA text (usually "DOA")',
          initialValue: 'DOA',
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          description: 'Text below the main logo',
          initialValue: 'DEPARTMENT OF ART',
        }),
        defineField({
          name: 'showLogo',
          title: 'Show Logo',
          type: 'boolean',
          description: 'Show the DOA logo image',
          initialValue: true,
        }),
      ],
    }),
    
    // Section Titles
    defineField({
      name: 'sectionTitles',
      title: 'Section Titles',
      type: 'object',
      fields: [
        defineField({
          name: 'featuredProjects',
          title: 'Featured Projects Title',
          type: 'string',
          initialValue: 'FEATURED PROJECTS',
        }),
        defineField({
          name: 'whatWeDo',
          title: 'What We Do Title',
          type: 'string',
          initialValue: 'WHAT WE DO',
        }),
        defineField({
          name: 'ourClients',
          title: 'Our Clients Title',
          type: 'string',
          initialValue: 'Our Clients',
        }),
        defineField({
          name: 'testimonials',
          title: 'Testimonials Title',
          type: 'string',
          initialValue: 'Client Testimonials',
        }),
        defineField({
          name: 'aboutCTA',
          title: 'About CTA Title',
          type: 'string',
          initialValue: 'Ready to Create Something Extraordinary?',
        }),
      ],
    }),
    
    // About CTA Section
    defineField({
      name: 'aboutCTA',
      title: 'About Call-to-Action',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'Ready to Create Something Extraordinary?',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue: 'With over 20 years of experience in film and television production design, Department of Art brings your creative vision to life with unmatched craftsmanship and artistic excellence.',
        }),
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Discover Our Story',
        }),
        defineField({
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
          initialValue: '/about',
        }),
      ],
    }),
    
    // SEO Settings
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Title for search engines',
          validation: Rule => Rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Description for search engines',
          validation: Rule => Rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social media sharing',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare() {
      return {
        title: 'Homepage Settings',
        subtitle: 'Configure homepage content and sections',
      }
    },
  },
})