
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'your-default-secret-key-change-me';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = 'session';

interface SessionPayload {
  userId: string;
  iat: number;
  exp: number;
}

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ userId });
  
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const decoded = await decrypt(sessionCookie);
    return decoded;
  } catch (error) {
    // This is expected if the token is invalid or expired
    // console.error('[getSession] Error decrypting session:', error);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', { expires: new Date(0), path: '/' });
}

async function encrypt(payload: { userId: string }): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt(iat)
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    // This will catch errors like expired tokens, invalid signatures, etc.
    // console.error('[decrypt] Failed to verify JWT:', error);
    return null;
  }
}

export async function requireAuth(redirectTo = '/login') {
    const session = await getSession();
    if (!session) {
      redirect(redirectTo);
    }
    return session.userId;
}
