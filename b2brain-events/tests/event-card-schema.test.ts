import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'

test('collection card excerpts use the concise 90–220 character schema contract', () => {
  const schema = readFileSync('sanity/schemaTypes/documents/event.ts', 'utf8')
  assert.match(schema, /name: 'cardExcerpt'[\s\S]*?120–200 characters/)
  assert.match(schema, /name: 'cardExcerpt'[\s\S]*?r\.min\(90\)\.max\(220\)/)
})

test('the collection query prefers the dedicated excerpt before long-form fallbacks', () => {
  const query = readFileSync('sanity/lib/queries.ts', 'utf8')
  assert.match(query, /"description": coalesce\(cardExcerpt, tldr, tagline\)/)
})
