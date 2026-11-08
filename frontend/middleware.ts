import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, ROLE_ACCESS, normalizeRole } from '@/lib/session';

// Rute yang tidak butuh login
const PUBLIC_PATHS = ['/login', '/'];

function isAllowed(rawRole: string | undefined, pathname: string): boolean {
  const allowed = ROLE_ACCESS[pathname] ?? null;
  if (allowed === null) return true; // semua role boleh
  if (!rawRole) return false;
  const role = normalizeRole(rawRole);
  if (!role) return false;
  return allowed.includes(role);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rawRole = req.cookies.get(SESSION_COOKIE)?.value;
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Belum login -> paksa ke /login
  if (!isPublic && !rawRole) {
    const loginUrl = new URL('/login', req.url);
    const res = NextResponse.redirect(loginUrl);
    // Tandai halaman yang ingin dituju agar kembali ke sana setelah login
    res.cookies.set('mjm_redirect', pathname, {
      path: '/',
      maxAge: 300,
      sameSite: 'lax',
    });
    return res;
  }

  // Sudah login tapi role tidak berhak -> lempar ke dashboard miliknya
  if (!isPublic && !isAllowed(rawRole, pathname)) {
    const role = normalizeRole(rawRole);
    const fallback =
      role === 'manager' ? '/manager-dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  // Sudah login membuka /login -> langsung ke dashboard
  if (isPublic && rawRole && pathname === '/login') {
    const role = normalizeRole(rawRole);
    const fallback = role === 'manager' ? '/manager-dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Jalankan middleware di semua rute kecuali internal Next.js & file statis
  // (gambar/font di /public tidak boleh kena redirect login)
  matcher: [
    '/((?!api|_next|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|webp|ico|woff2?)$).*)',
  ],
};
