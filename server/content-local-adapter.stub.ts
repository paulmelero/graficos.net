// The Cloudflare worker uses D1. Prerendering still needs the local SQLite adapter.
export default async function localAdapter(config: unknown) {
  if (!import.meta.prerender) {
    throw new Error('The local content database is not available in the Cloudflare worker.')
  }
  const { default: betterSqlite3 } = await import('db0/connectors/better-sqlite3')
  return betterSqlite3(config as Parameters<typeof betterSqlite3>[0])
}
