import { redirect } from 'next/navigation'

/**
 * This project owns the /events tree only. The root exists so local dev has a
 * sensible landing spot; in production the marketing root is served elsewhere
 * (or this app is mounted at a path — see docs/DEPLOYMENT.md).
 */
export default function Home() {
  redirect('/events')
}
