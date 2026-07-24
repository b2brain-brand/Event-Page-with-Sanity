import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/sanity/lib/client'
import { readToken } from '@/sanity/env'

/**
 * GET /api/draft-mode/enable
 *
 * The Studio's Presentation tool calls this to turn on preview. next-sanity
 * validates the request against the read token before setting the cookie, so a
 * stray link cannot expose drafts to the public.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: readToken }),
})
