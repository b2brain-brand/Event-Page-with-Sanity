import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/** GET /api/draft-mode/disable — the exit hatch behind the preview pill. */
export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()

  const url = new URL(request.url)
  redirect(url.searchParams.get('redirect') || '/events')
}
