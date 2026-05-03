import type { Env, User } from '../db/schema'

const SESSION_COOKIE_NAME = 'aeronav_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30
const textEncoder = new TextEncoder()

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

type SessionPayload = {
  username: string
  exp: number
}

function toBase64Url(input: string | Uint8Array) {
  const bytes = typeof input === 'string' ? textEncoder.encode(input) : input
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
}

async function importSessionKey(secret: string) {
  return crypto.subtle.importKey('raw', textEncoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

async function signSessionPayload(payloadBase64: string, secret: string) {
  const key = await importSessionKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(payloadBase64))
  return toBase64Url(new Uint8Array(signature))
}

function getRequiredEnv(env: Env, key: 'ADMIN_USERNAME' | 'ADMIN_PASSWORD' | 'SESSION_SECRET') {
  const value = env[key]
  if (!value) {
    throw new ApiError(500, 'AUTH_CONFIG_MISSING', `Missing required auth config: ${key}`)
  }
  return value
}

function getCookieValue(request: Request, name: string) {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null

  for (const part of cookieHeader.split(';')) {
    const [rawName, ...rawValue] = part.trim().split('=')
    if (rawName === name) {
      return rawValue.join('=')
    }
  }

  return null
}

function buildUser(username: string): User {
  return {
    email: username,
    subject: `admin:${username}`,
    name: username,
    displayName: username,
  }
}

function getSessionExpiresAt() {
  return Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
}

function isSecureRequest(request: Request) {
  return new URL(request.url).protocol === 'https:'
}

export async function createSessionCookie(env: Env, username: string, request: Request) {
  const payload = toBase64Url(JSON.stringify({ username, exp: getSessionExpiresAt() } satisfies SessionPayload))
  const signature = await signSessionPayload(payload, getRequiredEnv(env, 'SESSION_SECRET'))
  const secure = isSecureRequest(request) ? '; Secure' : ''
  return `${SESSION_COOKIE_NAME}=${payload}.${signature}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`
}

export function clearSessionCookie(request: Request) {
  const secure = isSecureRequest(request) ? '; Secure' : ''
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
}

export async function verifyAdminCredentials(env: Env, username: string, password: string) {
  const expectedUsername = getRequiredEnv(env, 'ADMIN_USERNAME')
  const expectedPassword = getRequiredEnv(env, 'ADMIN_PASSWORD')
  return username === expectedUsername && password === expectedPassword
}

export async function getSessionUser(request: Request, env: Env): Promise<User | null> {
  const cookie = getCookieValue(request, SESSION_COOKIE_NAME)
  if (!cookie) return null

  const [payloadBase64, signature] = cookie.split('.')
  if (!payloadBase64 || !signature) return null

  const expectedSignature = await signSessionPayload(payloadBase64, getRequiredEnv(env, 'SESSION_SECRET'))
  if (signature !== expectedSignature) return null

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadBase64))) as Partial<SessionPayload>
    if (typeof payload.username !== 'string' || typeof payload.exp !== 'number') {
      return null
    }
    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }
    return buildUser(payload.username)
  } catch {
    return null
  }
}

export async function requireUser(request: Request, env: Env): Promise<User> {
  const user = await getSessionUser(request, env)
  if (!user) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Missing or invalid admin session')
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
      code { color:#f8fafc; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="eyebrow">Private navigation</div>
      <h1>需要先登录管理员账户</h1>
      <p>当前请求没有携带有效的后台会话。请先调用 <code>/api/login</code> 完成登录，再访问业务页面或 API。</p>
    </div>
  </body>
</html>`
}

export async function ensureSettings(env: Env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      sort_order INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
  ).run()

  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT,
      description TEXT,
      sort_order INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (group_id) REFERENCES groups(id)
    )`,
  ).run()

  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      theme_mode TEXT NOT NULL DEFAULT 'system',
      card_density TEXT NOT NULL DEFAULT 'comfortable',
      open_in_new_tab INTEGER NOT NULL DEFAULT 1,
      show_group_icons INTEGER NOT NULL DEFAULT 1,
      search_engine TEXT NOT NULL DEFAULT 'bing',
      weather_enabled INTEGER NOT NULL DEFAULT 1,
      weather_auto_locate INTEGER NOT NULL DEFAULT 0,
      temperature_unit TEXT NOT NULL DEFAULT 'system',
      wallpaper_url TEXT,
      wallpaper_overlay_opacity INTEGER NOT NULL DEFAULT 78,
      wallpaper_blur INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    )`,
  ).run()

  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS user_profiles (
      subject TEXT PRIMARY KEY,
      display_name TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
  ).run()

  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS web_panels (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT,
      description TEXT,
      open_mode TEXT NOT NULL DEFAULT 'iframe',
      enabled INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
  ).run()

  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_groups_sort_order ON groups(sort_order)').run()
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_links_group_sort ON links(group_id, sort_order)').run()
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_web_panels_enabled ON web_panels(enabled)').run()
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_web_panels_sort_order ON web_panels(sort_order)').run()

  try {
    await env.DB.prepare(
      `INSERT INTO settings (id, theme_mode, card_density, open_in_new_tab, show_group_icons, search_engine, weather_enabled, weather_auto_locate, temperature_unit, wallpaper_url, wallpaper_overlay_opacity, wallpaper_blur, updated_at)
       VALUES (1, 'system', 'comfortable', 1, 1, 'bing', 1, 0, 'system', NULL, 78, 0, ?)
       ON CONFLICT(id) DO NOTHING`,
    )
      .bind(new Date().toISOString())
      .run()
  } catch {
    await env.DB.prepare(
      `INSERT INTO settings (id, theme_mode, card_density, open_in_new_tab, show_group_icons, search_engine, weather_enabled, weather_auto_locate, temperature_unit, updated_at)
       VALUES (1, 'system', 'comfortable', 1, 1, 'bing', 1, 0, 'system', ?)
       ON CONFLICT(id) DO NOTHING`,
    )
      .bind(new Date().toISOString())
      .run()
  }
}
