import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

/**
 * Build a tagged template array from a SQL string with $1, $2, etc. placeholders.
 * This converts "SELECT * FROM t WHERE id = $1 AND name = $2"
 * into the parts: ["SELECT * FROM t WHERE id = ", " AND name = ", ""]
 */
function buildTemplate(sql: string, paramCount: number): TemplateStringsArray {
  const parts: string[] = []
  let remaining = sql

  for (let i = 1; i <= paramCount; i++) {
    const idx = remaining.indexOf(`$${i}`)
    if (idx === -1) break
    parts.push(remaining.slice(0, idx))
    remaining = remaining.slice(idx + `$${i}`.length)
  }
  parts.push(remaining)

  // TemplateStringsArray requires a 'raw' property
  const template = parts as unknown as TemplateStringsArray
  Object.defineProperty(template, 'raw', { value: parts })
  return template
}

/**
 * Execute a parameterized SQL query.
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  if (!DATABASE_URL) return []

  const sqlFn = neon(DATABASE_URL)

  if (!params || params.length === 0) {
    const template = buildTemplate(sql, 0)
    const result = await sqlFn(template)
    return result as unknown as T[]
  }

  const template = buildTemplate(sql, params.length)
  const result = await sqlFn(template, ...params)
  return result as unknown as T[]
}

/**
 * Execute a SQL query and return the first row, or null.
 */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}

/**
 * Execute an INSERT/UPDATE/DELETE.
 */
export async function execute(
  sql: string,
  params?: unknown[]
): Promise<number> {
  if (!DATABASE_URL) return 0
  const result = await query(sql, params)
  return Array.isArray(result) ? result.length : 0
}
