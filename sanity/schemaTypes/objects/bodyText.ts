import {defineType} from 'sanity'

/**
 * Simple body text with bold, italic, and links only
 * Used for descriptions, bios, and body copy throughout the site
 *
 * Design principle: "A little goes a long way"
 * Keep formatting minimal and muted for optimal readability on black backgrounds
 */
export const bodyText = defineType({
  name: 'bodyText',
  title: 'Body Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
      ],
      lists: [], // No lists for simple body text
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
            ],
          },
        ],
      },
    },
  ],
})

/**
 * Rich body text with lists enabled
 * Used for longer-form content like about page sections
 */
export const richBodyText = defineType({
  name: 'richBodyText',
  title: 'Rich Body Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
            ],
          },
        ],
      },
    },
  ],
})
