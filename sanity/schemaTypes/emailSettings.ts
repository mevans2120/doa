import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'emailSettings',
  title: 'Email Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'This is just for internal reference',
      initialValue: 'Email Settings',
      readOnly: true,
    }),
    
    // Auto-Reply Email Settings
    defineField({
      name: 'autoReply',
      title: 'Auto-Reply Email',
      type: 'object',
      description: 'Email sent automatically to users after they submit the contact form',
      fields: [
        defineField({
          name: 'subject',
          title: 'Subject Line',
          type: 'string',
          validation: Rule => Rule.required(),
          initialValue: 'Thank you for contacting Department of Art',
        }),
        defineField({
          name: 'greeting',
          title: 'Greeting',
          type: 'string',
          description: 'Will be followed by the user\'s name (e.g., "Hi John,")',
          initialValue: 'Hi',
        }),
        defineField({
          name: 'mainMessage',
          title: 'Main Message',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.required(),
          initialValue: 'Thank you for reaching out to Department of Art. We\'ve received your message and appreciate your interest in our services.',
        }),
        defineField({
          name: 'responseTime',
          title: 'Response Time Message',
          type: 'text',
          rows: 2,
          initialValue: 'Our team will review your inquiry and get back to you within 24-48 hours. If your project requires immediate attention, please feel free to call us directly.',
        }),
        defineField({
          name: 'servicesIntro',
          title: 'Services Introduction',
          type: 'string',
          initialValue: 'Department of Art specializes in professional set construction for:',
        }),
        defineField({
          name: 'services',
          title: 'Services List',
          type: 'array',
          of: [{type: 'string'}],
          initialValue: [
            'Film & Television Productions',
            'Commercial & Advertising Campaigns',
            'Custom Prop Building & Fabrication',
            'Set Design & Construction',
            'Production Design Consultation'
          ],
        }),
        defineField({
          name: 'closingMessage',
          title: 'Closing Message',
          type: 'text',
          rows: 2,
          initialValue: 'We look forward to discussing how we can bring your creative vision to life with our expertise in production design and set construction.',
        }),
        defineField({
          name: 'signature',
          title: 'Signature',
          type: 'string',
          initialValue: 'Best regards,\nThe Department of Art Team',
        }),
      ],
    }),
    
    // Admin Notification Email Settings
    defineField({
      name: 'adminNotification',
      title: 'Admin Notification Email',
      type: 'object',
      description: 'Email sent to admin when a contact form is submitted. Email routing (from/to addresses) is configured via environment variables.',
      fields: [
        defineField({
          name: 'subjectPrefix',
          title: 'Subject Prefix',
          type: 'string',
          description: 'Will be followed by "from [Name]"',
          initialValue: 'New Contact Form Submission',
        }),
      ],
    }),
    
    // Email Footer Settings (simplified - using Site Settings for contact info)
    defineField({
      name: 'footer',
      title: 'Email Footer Settings',
      type: 'object',
      description: 'Footer configuration for emails. Contact information is pulled from Site Settings.',
      fields: [
        defineField({
          name: 'showContactInfo',
          title: 'Show Contact Information',
          type: 'boolean',
          description: 'Display contact information from Site Settings in email footer',
          initialValue: true,
        }),
        defineField({
          name: 'additionalText',
          title: 'Additional Footer Text',
          type: 'text',
          rows: 2,
          description: 'Optional additional text to include in email footer',
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
        title: 'Email Settings',
        subtitle: 'Configure email templates and settings',
      }
    },
  },
})