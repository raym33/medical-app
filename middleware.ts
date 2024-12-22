import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SessionManager } from '@/lib/security/session-manager';
import { AccessLogger } from '@/lib/security/access-logger';

export async function middleware(request: NextRequest) {
  // Skip auth for public routes
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }

  const sessionId = request.cookies.get('session_id')?.value;
  const doctorId = request.cookies.get('doctor_id')?.value;

  if (!sessionId || !doctorId) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const sessionManager = SessionManager.getInstance();
    const isValid = await sessionManager.validateSession(sessionId);

    if (!isValid) {
      await AccessLogger.logAccess(doctorId, 'session_validation', 'failure');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    await sessionManager.extendSession(sessionId);
    await AccessLogger.logAccess(doctorId, 'access_page', 'success', {
      path: request.nextUrl.pathname
    });

    return NextResponse.next();
  } catch (error) {
    await AccessLogger.logAccess(doctorId, 'middleware_error', 'failure', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*'
  ]
};