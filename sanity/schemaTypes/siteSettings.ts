import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // Basic Site Info
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      description: 'For SEO purposes',
    }),
    
    // SEO & Meta Tags
    defineField({
      name: 'seo',
      title: 'Default SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'siteUrl',
          title: 'Site URL',
          type: 'url',
        }),
        defineField({
          name: 'socialImage',
          title: 'Default Social Share Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'twitterCard',
          title: 'Twitter Card Type',
          type: 'string',
          options: {
            list: [
              {title: 'Summary', value: 'summary'},
              {title: 'Summary Large Image', value: 'summary_large_image'},
            ],
          },
          initialValue: 'summary_large_image',
        }),
      ],
    }),
    
    // Contact Information
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'email',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({
          name: 'companyName',
          title: 'Company Name',
          type: 'string',
        }),
        defineField({
          name: 'street',
          title: 'Street Address',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
        }),
        defineField({
          name: 'state',
          title: 'State',
          type: 'string',
        }),
        defineField({
          name: 'zip',
          title: 'ZIP Code',
          type: 'string',
        }),
        defineField({
          name: 'googleMapsUrl',
          title: 'Google Maps URL',
          type: 'url',
        }),
      ],
    }),
    
    // Footer Content
    defineField({
      name: 'footer',
      title: 'Footer Content',
      type: 'object',
      fields: [
        defineField({
          name: 'companyDescription',
          title: 'Company Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'tagline',
          title: 'Company Tagline',
          type: 'string',
          description: 'e.g., "Build • Destroy"',
        }),
        defineField({
          name: 'services',
          title: 'Services List',
          type: 'array',
          of: [{type: 'string'}],
          description: 'Services shown in footer',
        }),
        defineField({
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          description: 'Use {year} for current year',
          initialValue: '© {year} Department of Art. All rights reserved.',
        }),
      ],
    }),
    
    // Navigation
    defineField({
      name: 'navigation',
      title: 'Navigation Labels',
      type: 'object',
      fields: [
        defineField({
          name: 'home',
          title: 'Home Label',
          type: 'string',
          initialValue: 'Home',
        }),
        defineField({
          name: 'projects',
          title: 'Projects Label',
          type: 'string',
          initialValue: 'Our Work',
        }),
        defineField({
          name: 'services',
          title: 'Services Label',
          type: 'string',
          initialValue: 'What We Do',
        }),
        defineField({
          name: 'clients',
          title: 'Clients Label',
          type: 'string',
          initialValue: 'Our Clients',
        }),
        defineField({
          name: 'about',
          title: 'About Label',
          type: 'string',
          initialValue: 'About',
        }),
        defineField({
          name: 'contact',
          title: 'Contact Label',
          type: 'string',
          initialValue: 'Contact',
        }),
      ],
    }),
    
    // Social Media
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        {name: 'instagram', type: 'url', title: 'Instagram'},
        {name: 'linkedin', type: 'url', title: 'LinkedIn'},
        {name: 'vimeo', type: 'url', title: 'Vimeo'},
        {name: 'facebook', type: 'url', title: 'Facebook'},
        {name: 'twitter', type: 'url', title: 'Twitter'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})