import { z } from 'zod'
import type { Env, User } from '../db/schema'
import { ApiError, jsonSuccess } from '../auth/access'
import { applyUserProfile, getUserProfile, upsertUserProfile } from '../db/repo'

const updateUserSchema = z.object({
  displayName: z.string().trim().max(80),
})

export async function updateUser(request: Request, env: Env, user: User) {
  const parsed = updateUserSchema.safeParse(await request.json())
  if (!parsed.success) {
    throw new ApiError(400, 'INVALID_USER', 'Invalid user payload', parsed.error.flatten())
  }

  const displayName = parsed.data.displayName || null
  const profile = await upsertUserProfile(env, user.subject, displayName)
  return jsonSuccess({ user: applyUserProfile(user, profile) })
}

export async function getUser(env: Env, user: User) {
  const profile = await getUserProfile(env, user.subject)
  return jsonSuccess({ user: applyUserProfile(user, profile) })
}
