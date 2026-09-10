import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('the article TOC scrolls in normal document flow on desktop and mobile', () => {
  const css = readFileSync('src/app/globals.css', 'utf8')
  const rules = css.match(/\.article__toc\{[^}]+\}/g) || []

  assert.ok(rules.length >= 1)
  assert.ok(rules.every((rule) => rule.includes('position:static')))
  assert.ok(rules.every((rule) => !rule.includes('position:sticky')))
})
