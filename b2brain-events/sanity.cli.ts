import { defineCliConfig } from 'sanity/cli'
import { dataset, projectId } from './sanity/env'

/**
 * Only used by the `sanity` CLI (schema extract, typegen, dataset import/export).
 * The Studio itself is served by Next.js at /studio, not by `sanity dev`.
 */
export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: 'b2brain-events',
  autoUpdates: true,
})
