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
      description: 'Email sent to admin when a contact form is submitted',
      fields: [
        defineField({
          name: 'subjectPrefix',
          title: 'Subject Prefix',
          type: 'string',
          description: 'Will be followed by "from [Name]"',
          initialValue: 'New Contact Form Submission',
        }),
        defineField({
          name: 'toEmail',
          title: 'Send To Email',
          type: 'email',
          validation: Rule => Rule.required(),
          description: 'Email address where form submissions should be sent',
          initialValue: 'info@departmentofart.com',
        }),
        defineField({
          name: 'fromEmail',
          title: 'From Email',
          type: 'email',
          validation: Rule => Rule.required(),
          description: 'Email address that appears as the sender',
          initialValue: 'contact@departmentofart.com',
        }),
        defineField({
          name: 'fromName',
          title: 'From Name',
          type: 'string',
          description: 'Name that appears as the sender',
          initialValue: 'DOA Contact Form',
        }),
      ],
    }),
    
    // Email Footer Settings
    defineField({
      name: 'footer',
      title: 'Email Footer',
      type: 'object',
      description: 'Footer contact information for emails. NOTE: These should match the values in Site Settings for consistency.',
      fields: [
        defineField({
          name: 'contactInfo',
          title: 'Contact Information',
          type: 'object',
          description: 'Keep these synchronized with Site Settings for consistency across the website',
          fields: [
            defineField({
              name: 'phone',
              title: 'Phone Number',
              type: 'string',
              initialValue: '(503) 555-0100',
            }),
            defineField({
              name: 'email',
              title: 'Email',
              type: 'email',
              initialValue: 'info@departmentofart.com',
            }),
            defineField({
              name: 'website',
              title: 'Website URL',
              type: 'url',
              initialValue: 'https://departmentofart.com',
            }),
            defineField({
              name: 'address',
              title: 'Address',
              type: 'text',
              rows: 2,
              initialValue: 'Department of Art Productions\n6500 NE Portland Hwy\nPortland, OR 97218',
            }),
          ],
        }),
        defineField({
          name: 'tagline',
          title: 'Company Tagline',
          type: 'string',
          initialValue: 'Build • Destroy',
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