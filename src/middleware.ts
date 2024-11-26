import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_ADDRESS = "0x8F0e2980701E313665cB40460d552d7Ad7f1BBB8";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const userAddress = request.headers.get('x-user-address');
    
    if (userAddress !== ADMIN_ADDRESS) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin',
}; 