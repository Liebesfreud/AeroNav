import { z } from 'zod'
import type { Env } from '../db/schema'
import { ApiError, assertLoginAllowed, clearSessionCookie, createSessionCookie, jsonSuccess, recordLoginResult, verifyAdminCredentials } from '../auth/access'

const loginSchema = z.object({
  username: z.string().trim().min(1).max(120),
  password: z.string().min(1).max(1000),
})

export async function login(request: Request, env: Env) {
  const parsed = loginSchema.safeParse(await request.json())
  if (!parsed.success) {
    throw new ApiError(400, 'INVALID_LOGIN', 'Invalid login payload', parsed.error.flatten())
  }

  const { username, password } = parsed.data
  await assertLoginAllowed(request, env, username)
  const isValid = await verifyAdminCredentials(env, username, password)
  await recordLoginResult(request, env, username, isValid)

  if (!isValid) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid username or password')
  }

  return jsonSuccess(
    { authenticated: true, username },
    {
      headers: {
        'set-cookie': await createSessionCookie(env, username, request),
      },
    },
  )
}

export async function logout(request: Request) {
  return jsonSuccess(
    { authenticated: false },
    {
      headers: {
        'set-cookie': clearSessionCookie(request),
      },
    },
  )
}
