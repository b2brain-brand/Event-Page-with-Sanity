'use client'

/**
 * Studio config. Mounted inside the Next.js app at /studio — one repo, one
 * Vercel deployment, one set of environment variables. Editors never leave the
 * domain, and Presentation gives them the real page beside the form.
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'b2brain-events',
  title: 'B2Brain — Events',
  basePath: '/studio',
  projectId,
  dataset,

  schema: {
    types: schemaTypes,
    // Site settings is a singleton: hide it from the global "create new" menu.
    templates: (prev) => prev.filter((t) => t.schemaType !== 'siteSettings'),
  },

  document: {
    // Same guard on the "+" in the document lists.
    newDocumentOptions: (prev) =>
      prev.filter((item) => item.templateId !== 'siteSettings'),
  },

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        preview: '/events',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
