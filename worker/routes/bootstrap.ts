import type { Env, User } from '../db/schema'
import { jsonSuccess } from '../auth/access'
import { getBootstrap, getBootstrapVersion } from '../db/repo'

function quoteEtag(value: string) {
  return `"${value.replaceAll('"', '%22')}"`
}

export async function bootstrap(request: Request, env: Env, user: User) {
  const version = quoteEtag(await getBootstrapVersion(env, user))

  if (request.headers.get('if-none-match') === version) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: version,
        'Cache-Control': 'private, no-cache',
      },
    })
  }

  return jsonSuccess(await getBootstrap(env, user), {
    headers: {
      ETag: version,
      'Cache-Control': 'private, no-cache',
    },
  })
}
