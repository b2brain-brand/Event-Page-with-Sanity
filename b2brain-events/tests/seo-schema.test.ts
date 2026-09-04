import assert from 'node:assert/strict'
import test from 'node:test'

import {seo} from '../sanity/schemaTypes/objects/shared'

test('event meta descriptions use the 160–260 character SEO contract', () => {
  const metaDescription = seo.fields.find((field) => field.name === 'metaDescription') as {
    description?: string
    validation?: (rule: unknown) => unknown
  }

  assert.ok(metaDescription)
  assert.match(metaDescription.description ?? '', /160–260/)

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

  metaDescription.validation?.(rule)

  assert.deepEqual(calls, [
    ['min', 160],
    ['max', 260],
    ['warning', 'Use 160–260 characters to match the event-page SEO content contract.'],
  ])
})
