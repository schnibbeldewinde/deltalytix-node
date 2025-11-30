import { prisma } from '@/lib/prisma'
import { getUserId } from '@/server/auth'

/**
 * Resolve the OpenAI API key with the following priority:
 * 1) process.env.OPENAI_API_KEY
 * 2) current signed-in user's stored key (User.openaiApiKey)
 * 3) any stored user key in the database
 */
export async function resolveOpenAIKey(): Promise<string | null> {
  let apiKey = process.env.OPENAI_API_KEY || ''
  let source: 'env' | 'user' | 'fallback' | 'none' = apiKey ? 'env' : 'none'

  try {
    const uid = await getUserId()
    if (uid) {
      const user = await prisma.user.findUnique({
        where: { id: uid },
        select: { openaiApiKey: true }
      })
      if (user?.openaiApiKey) {
        apiKey = user.openaiApiKey
        source = 'user'
      }
    }
  } catch (e) {
    console.warn('OpenAI key lookup failed, fallback to env', e)
  }

  if (!apiKey) {
    const anyKey = await prisma.user.findFirst({
      where: { openaiApiKey: { not: null } },
      select: { openaiApiKey: true }
    })
    if (anyKey?.openaiApiKey) {
      apiKey = anyKey.openaiApiKey
      source = 'fallback'
    }
  }

  console.log('[resolveOpenAIKey] source:', source, 'len:', apiKey ? apiKey.length : 0)
  return apiKey || null
}
