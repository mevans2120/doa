'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './sanity/schemaTypes'
import {structure} from './sanity/deskStructure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vc89ievx'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'DOA Studio',
  projectId,
  dataset,
  plugins: [structureTool({structure})],
  schema: {
    types: schemaTypes,
  },
  basePath: '/studio',
})