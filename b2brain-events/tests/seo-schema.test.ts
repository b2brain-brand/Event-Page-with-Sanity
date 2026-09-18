import assert from 'node:assert/strict'
import test from 'node:test'

import {seo} from '../sanity/schemaTypes/objects/shared'

type SeoField = {description?: string; validation?: (rule: unknown) => unknown}

function validationCalls(field: SeoField) {
  const calls: Array<[string, ...unknown[]]> = []
  const rule = {
    min(value: number) {
      calls.push(['min', value])
      return rule
    },
    max(value: number) {
      calls.push(['max', value])
      return rule
    },
    warning(message: string) {
      calls.push(['warning', message])
      return rule
    },
  }

  field.validation?.(rule)
  return calls
}

test('event meta titles use a maximum-only 120 character SEO contract', () => {
  const metaTitle = seo.fields.find((field) => field.name === 'metaTitle') as SeoField

  assert.ok(metaTitle)
  assert.match(metaTitle.description ?? '', /Maximum 120/)
  assert.deepEqual(validationCalls(metaTitle), [
    ['max', 120],
    ['warning', 'Use no more than 120 characters for the event-page meta title.'],
  ])
})

test('event meta descriptions use a maximum-only 260 character SEO contract', () => {
  const metaDescription = seo.fields.find((field) => field.name === 'metaDescription') as SeoField

  assert.ok(metaDescription)
  assert.match(metaDescription.description ?? '', /Maximum 260/)
  assert.deepEqual(validationCalls(metaDescription), [
    ['max', 260],
    ['warning', 'Use no more than 260 characters for the event-page meta description.'],
  ])
})

test('event SEO schema does not expose a no-index control', () => {
  const fieldNames = seo.fields.map((field) => String(field.name))
  assert.equal(fieldNames.includes('noIndex'), false)
})
