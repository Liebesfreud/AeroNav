import type { Env, User } from '../db/schema'
import { jsonSuccess } from '../auth/access'
import { getBootstrap } from '../db/repo'

export async function bootstrap(env: Env, user: User) {
  const data = await getBootstrap(env)
  return jsonSuccess({ user, ...data })
}
