import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = 'secret-key-change-me'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 week')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  try {
    return await decrypt(session)
  } catch (error) {
    return null
  }
}

export async function updateSession() {
  const session = await cookies().then((c) => c.get('session')?.value)
  if (!session) return

  // Refresh logic if needed
  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const res = await cookies()
  res.set('session', await encrypt(parsed), {
    httpOnly: true,
    secure: true,
    expires: parsed.expires,
    sameSite: 'lax',
    path: '/',
  })
}
