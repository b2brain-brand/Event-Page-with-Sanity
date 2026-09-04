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

test('event meta titles use the 100–120 character SEO contract', () => {
  const metaTitle = seo.fields.find((field) => field.name === 'metaTitle') as SeoField

  assert.ok(metaTitle)
  assert.match(metaTitle.description ?? '', /100–120/)
  assert.deepEqual(validationCalls(metaTitle), [
    ['min', 100],
    ['max', 120],
    ['warning', 'Use 100–120 characters to match the event-page SEO content contract.'],
  ])
})

test('event meta descriptions use the 160–260 character SEO contract', () => {
  const metaDescription = seo.fields.find((field) => field.name === 'metaDescription') as SeoField

  assert.ok(metaDescription)
  assert.match(metaDescription.description ?? '', /160–260/)
  assert.deepEqual(validationCalls(metaDescription), [
    ['min', 160],
    ['max', 260],
    ['warning', 'Use 160–260 characters to match the event-page SEO content contract.'],
  ])
})
