import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: () => true,
      initialValue: 'Contact Page',
    }),

    // Hero Section
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Page Title',
          type: 'string',
          initialValue: 'Contact Us',
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          initialValue: "Let's Bring Your Creative Vision to Life",
        }),
      ],
    }),
    
    // Contact Form Section
    defineField({
      name: 'contactForm',
      title: 'Contact Form Section',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Get in Touch',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue: "Ready to bring your creative vision to life? We'd love to hear about your project. Fill out the form below and our team will get back to you within 24 hours.",
        }),
        defineField({
          name: 'nameLabel',
          title: 'Name Field Label',
          type: 'string',
          initialValue: 'Name',
        }),
        defineField({
          name: 'emailLabel',
          title: 'Email Field Label',
          type: 'string',
          initialValue: 'Email',
        }),
        defineField({
          name: 'messageLabel',
          title: 'Message Field Label',
          type: 'string',
          initialValue: 'Message',
        }),
        defineField({
          name: 'submitButton',
          title: 'Submit Button Text',
          type: 'string',
          initialValue: 'Send Message',
        }),
        defineField({
          name: 'submittingText',
          title: 'Submitting State Text',
          type: 'string',
          initialValue: 'Sending...',
        }),
        defineField({
          name: 'successMessage',
          title: 'Success Message',
          type: 'string',
          initialValue: 'Message sent successfully!',
        }),
        defineField({
          name: 'errorMessage',
          title: 'Error Message',
          type: 'string',
          initialValue: 'Something went wrong. Please try again.',
        }),
      ],
    }),
    
    // Visit Our Studio Section
    defineField({
      name: 'studioInfo',
      title: 'Studio Information',
      type: 'object',
      description: 'Contact details (address, phone, email) are pulled from Site Settings. Configure page-specific labels and display options here.',
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Visit Our Studio',
        }),
        defineField({
          name: 'addressLabel',
          title: 'Address Label',
          type: 'string',
          initialValue: 'Address',
        }),
        defineField({
          name: 'phoneLabel',
          title: 'Phone Label',
          type: 'string',
          initialValue: 'Phone',
        }),
        defineField({
          name: 'emailLabel',
          title: 'Email Label',
          type: 'string',
          initialValue: 'Email',
        }),
        defineField({
          name: 'hoursLabel',
          title: 'Hours Label',
          type: 'string',
          initialValue: 'Business Hours',
        }),
        defineField({
          name: 'hoursText',
          title: 'Hours Text (Optional Override)',
          type: 'text',
          rows: 2,
          description: 'Leave empty to use business hours from Site Settings. Fill this to override with custom hours for the contact page.',
        }),
        defineField({
          name: 'googleMapsUrl',
          title: 'Google Maps Embed URL',
          type: 'url',
          description: 'The full embed URL from Google Maps (override the default from Site Settings if needed)',
          initialValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.0477544968!2d-122.59431668444!3d45.550666979102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5495a72d8e7e9c5b%3A0x0!2s6500%20NE%20Portland%20Hwy%2C%20Portland%2C%20OR%2097218!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus',
        }),
        defineField({
          name: 'showMap',
          title: 'Show Google Map',
          type: 'boolean',
          description: 'Toggle to show/hide the Google Map',
          initialValue: true,
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
          initialValue: 'Contact Us | Department of Art',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Description for search engines',
          initialValue: 'Get in touch with Department of Art for professional set construction, production design, and custom prop building services in Portland, Oregon.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: title || 'Contact Page',
        subtitle: 'Manage contact page content and settings',
      }
    },
  },
})