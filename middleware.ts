import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ADMIN_PATHS = ['/admin']

async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.')
    if (!headerB64 || !payloadB64 || !signatureB64) return false

    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const data = encoder.encode(`${headerB64}.${payloadB64}`)
    const signature = Uint8Array.from(
      atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    )

    const valid = await crypto.subtle.verify('HMAC', key, signature, data)
    if (!valid) return false

    // Check expiration
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp && Date.now() / 1000 > payload.exp) return false

    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin/* except /admin (login page)
  if (pathname.startsWith('/admin') && !PUBLIC_ADMIN_PATHS.includes(pathname)) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    const secret = process.env.JWT_SECRET || ''
    const valid = await verifyJWT(token, secret)
    if (!valid) {
      const response = NextResponse.redirect(new URL('/admin', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
