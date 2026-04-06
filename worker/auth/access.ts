import type { Env, User } from '../db/schema'

export class ApiError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

export function jsonSuccess<T>(data: T, init?: ResponseInit) {
  return Response.json({ ok: true, data, error: null }, init)
}

export function jsonError(error: ApiError) {
  return Response.json(
    {
      ok: false,
      data: null,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    },
    { status: error.status },
  )
}

function decodeAccessJwt(token: string): Partial<User> | null {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return {
      email: typeof json.email === 'string' ? json.email : undefined,
      subject: typeof json.sub === 'string' ? json.sub : undefined,
      name: typeof json.name === 'string' ? json.name : null,
    }
  } catch {
    return null
  }
}

function isLocalDevRequest(request: Request) {
  const { hostname } = new URL(request.url)
  return hostname === '127.0.0.1' || hostname === 'localhost'
}

function getLocalDevUser(request: Request): User | null {
  if (!isLocalDevRequest(request)) {
    return null
  }

  return {
    email: 'dev@local.aeronav',
    subject: 'local-dev-user',
    name: 'Local Dev',
  }
}

export function getAccessUser(request: Request): User | null {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email')
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion')
  const preferred = jwt ? decodeAccessJwt(jwt) : null
  const subject = preferred?.subject ?? request.headers.get('Cf-Access-Authenticated-User-Id') ?? email

  if (!email || !subject) {
    return getLocalDevUser(request)
  }

  return {
    email,
    subject,
    name: preferred?.name ?? null,
  }
}

export function requireUser(request: Request): User {
  const user = getAccessUser(request)
  if (!user) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Missing Cloudflare Access identity')
  }
  return user
}

export function unauthorizedHtml(appName = 'AeroNav') {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
    <style>
      body { margin:0; font-family: Inter, system-ui, sans-serif; background:#020617; color:#f8fafc; display:grid; min-height:100vh; place-items:center; padding:24px; }
      .card { width:min(100%, 420px); background:rgba(15,23,42,.78); border:1px solid rgba(148,163,184,.18); border-radius:24px; padding:28px; box-shadow:0 20px 60px rgba(0,0,0,.35); }
      .eyebrow { color:#94a3b8; font-size:12px; letter-spacing:.2em; text-transform:uppercase; }
      h1 { margin:10px 0 8px; font-size:28px; }
      p { margin:0; color:#cbd5e1; line-height:1.7; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="eyebrow">Private navigation</div>
      <h1>需要先通过 Access 认证</h1>
      <p>当前请求没有携带有效的 Cloudflare Access 身份信息，因此不会返回任何业务页面内容。</p>
    </div>
  </body>
</html>`
}

export async function ensureSettings(env: Env) {
  await env.DB.prepare(
    `INSERT INTO settings (id, theme_mode, card_density, open_in_new_tab, show_group_icons, updated_at)
     VALUES (1, 'system', 'comfortable', 1, 1, ?)
     ON CONFLICT(id) DO NOTHING`,
  )
    .bind(new Date().toISOString())
    .run()
}
