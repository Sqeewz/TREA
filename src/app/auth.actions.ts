'use server'

import { prisma } from '@/lib/prisma'
import { encrypt, getSession } from '@/lib/auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function register(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password || !name) {
    return { error: 'Missing required fields' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: 'Email already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  redirect('/login')
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Invalid email or password' }
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId: user.id.toString(), email: user.email, name: user.name, expires })

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: 'lax',
    path: '/',
  })

  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
  redirect('/login')
}
