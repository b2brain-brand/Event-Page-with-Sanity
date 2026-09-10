import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('the article TOC has a separate bounded scrollbar', () => {
  const css = readFileSync('src/app/globals.css', 'utf8')
  const tocRules = css.match(/\.article__toc\{[^}]+\}/g) || []
  const navRules = css.match(/\.article__toc nav\{[^}]+\}/g) || []

  assert.ok(tocRules.some((rule) => rule.includes('position:sticky')))
  assert.ok(tocRules.some((rule) => rule.includes('position:static')))
  assert.ok(navRules.some((rule) => rule.includes('overflow-y:auto')))
  assert.ok(navRules.every((rule) => rule.includes('max-height:')))
  assert.ok(navRules.some((rule) => rule.includes('overscroll-behavior:contain')))
})
