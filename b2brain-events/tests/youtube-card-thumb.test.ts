import assert from 'node:assert/strict'
import test from 'node:test'

import {resolveYouTubeCardThumb} from '../src/lib/youtube'

const originalFetch = globalThis.fetch

test.afterEach(() => {
  globalThis.fetch = originalFetch
})

test('card thumbnail prefers verified max-resolution artwork', async () => {
  const calls: string[] = []
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input)
    calls.push(url)
    if (url.includes('/oembed?')) return new Response('{}', {status: 200})
    return new Response(null, {status: 200, headers: {'content-type': 'image/jpeg'}})
  }) as typeof fetch

  const result = await resolveYouTubeCardThumb('AAAAAAAAAAA')

  assert.equal(result, 'https://i.ytimg.com/vi/AAAAAAAAAAA/maxresdefault.jpg')
  assert.equal(calls.length, 2)
})

test('card thumbnail uses the standard still when maxres is unavailable', async () => {
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input)
    if (url.includes('/oembed?')) return new Response('{}', {status: 200})
    if (url.includes('/maxresdefault.jpg')) return new Response(null, {status: 404})
    return new Response(null, {status: 200, headers: {'content-type': 'image/jpeg'}})
  }) as typeof fetch

  assert.equal(
    await resolveYouTubeCardThumb('BBBBBBBBBBB'),
    'https://i.ytimg.com/vi/BBBBBBBBBBB/sddefault.jpg',
  )
})

test('unavailable video never returns a grey or loading thumbnail', async () => {
  let thumbnailRequested = false
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input)
    if (url.includes('i.ytimg.com')) thumbnailRequested = true
    return new Response(null, {status: 404})
  }) as typeof fetch

  assert.equal(await resolveYouTubeCardThumb('CCCCCCCCCCC'), null)
  assert.equal(thumbnailRequested, false)
})
