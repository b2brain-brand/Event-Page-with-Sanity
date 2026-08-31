#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const envPath = path.join(root, '.env.local')
const manifestPath = process.argv.find((arg) => arg.endsWith('.json'))
const apply = process.argv.includes('--apply')

if (!manifestPath) {
  console.error('Usage: node scripts/backfill-event-videos.mjs <manifest.json> [--apply]')
  process.exit(2)
}

function parseEnv(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=')
        const key = line.slice(0, index).trim()
        const value = line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, '$2')
        return [key, value]
      }),
  )
}

const fileEnv = parseEnv(await fs.readFile(envPath, 'utf8'))
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || fileEnv.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || fileEnv.NEXT_PUBLIC_SANITY_DATASET
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  fileEnv.NEXT_PUBLIC_SANITY_API_VERSION ||
  '2024-10-28'
const token = process.env.SANITY_API_WRITE_TOKEN || fileEnv.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity project, dataset, or write token in .env.local.')
  process.exit(2)
}

const base = `https://${projectId}.api.sanity.io/v${apiVersion}`
const manifest = JSON.parse(await fs.readFile(path.resolve(root, manifestPath), 'utf8'))

function youtubeId(url) {
  return url.match(
    /(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  )?.[1]
}

async function sanityRequest(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? {'Content-Type': 'application/json'} : {}),
      ...init.headers,
    },
  })
  if (!response.ok) {
    throw new Error(`Sanity ${response.status}: ${(await response.text()).slice(0, 600)}`)
  }
  return response.json()
}

async function getDocument(id) {
  const query = encodeURIComponent('*[_id == $id][0]')
  const params = encodeURIComponent(JSON.stringify(id))
  const url = `${base}/data/query/${dataset}?query=${query}&$id=${params}`
  return (await sanityRequest(url)).result
}

async function verifyVideo(item) {
  const id = youtubeId(item.youtubeUrl)
  if (!id) throw new Error(`${item.slug}: invalid YouTube URL`)

  const oembed = new URL('https://www.youtube.com/oembed')
  oembed.searchParams.set('url', `https://www.youtube.com/watch?v=${id}`)
  oembed.searchParams.set('format', 'json')
  const response = await fetch(oembed)
  if (!response.ok) throw new Error(`${item.slug}: YouTube oEmbed returned ${response.status}`)
  const metadata = await response.json()

  const maxres = await fetch(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, {
    method: 'HEAD',
  })
  return {
    id,
    title: metadata.title,
    author: metadata.author_name,
    hasHdThumbnail: maxres.ok && (maxres.headers.get('content-type') || '').startsWith('image/'),
  }
}

function draftClone(document, item) {
  const next = structuredClone(document)
  delete next._rev
  delete next._createdAt
  delete next._updatedAt
  next._id = `drafts.event.${item.slug}`
  next.heroVideo = {
    _type: 'heroVideo',
    youtubeUrl: item.youtubeUrl,
    label: item.label,
    caption: item.caption,
    openOnYouTube: false,
  }
  next.lastUpdated = new Date().toISOString().slice(0, 10)
  next.sources = Array.isArray(next.sources) ? next.sources : []
  if (!next.sources.some((source) => source?.url === item.youtubeUrl)) {
    next.sources.push({
      _key: `youtube-${youtubeId(item.youtubeUrl)}`,
      _type: 'source',
      label: item.sourceLabel,
      url: item.youtubeUrl,
    })
  }
  return next
}

const results = []
const mutations = []

for (const item of manifest) {
  const verification = await verifyVideo(item)
  const draftId = `drafts.event.${item.slug}`
  const publishedId = `event.${item.slug}`
  const draft = await getDocument(draftId)
  const published = draft ? null : await getDocument(publishedId)
  const source = draft || published

  if (!source) {
    results.push({...item, status: 'missing-document', verification})
    continue
  }
  if (source.heroVideo?.youtubeUrl) {
    results.push({
      ...item,
      status: 'already-has-video',
      existingUrl: source.heroVideo.youtubeUrl,
      verification,
    })
    continue
  }

  const document = draftClone(source, item)
  mutations.push({createOrReplace: document})
  results.push({
    ...item,
    status: apply ? 'draft-updated' : 'would-update-draft',
    sourceDocument: source._id,
    verification,
  })
}

if (apply && mutations.length) {
  await sanityRequest(`${base}/data/mutate/${dataset}?returnIds=true`, {
    method: 'POST',
    body: JSON.stringify({mutations}),
  })
}

console.log(
  JSON.stringify(
    {
      mode: apply ? 'apply' : 'dry-run',
      verified: results.filter((item) => item.verification).length,
      hdThumbnailReady: results.filter((item) => item.verification?.hasHdThumbnail).length,
      draftWrites: mutations.length,
      results,
    },
    null,
    2,
  ),
)
