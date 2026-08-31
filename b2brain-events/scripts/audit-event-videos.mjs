#!/usr/bin/env node

import fs from 'node:fs/promises'

function parseEnv(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=')
        return [
          line.slice(0, index).trim(),
          line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, '$2'),
        ]
      }),
  )
}

const env = parseEnv(await fs.readFile('.env.local', 'utf8'))
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28'
const token = env.SANITY_API_WRITE_TOKEN || env.SANITY_API_READ_TOKEN
const query = encodeURIComponent(
  '*[_type == "event"]{_id, "slug": slug.current, "video": heroVideo.youtubeUrl}',
)
const response = await fetch(
  `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`,
  {headers: {Authorization: `Bearer ${token}`}},
)

if (!response.ok) throw new Error(`Sanity audit failed with ${response.status}`)

const documents = (await response.json()).result
const preferredBySlug = new Map()
for (const document of documents) {
  const current = preferredBySlug.get(document.slug)
  if (!current || document._id.startsWith('drafts.')) {
    preferredBySlug.set(document.slug, document)
  }
}

const preferred = [...preferredBySlug.values()]
const missing = preferred.filter((document) => !document.video)
console.log(
  JSON.stringify(
    {
      uniqueEvents: preferred.length,
      withHeroVideo: preferred.length - missing.length,
      missingHeroVideo: missing.map((document) => document.slug).sort(),
    },
    null,
    2,
  ),
)
