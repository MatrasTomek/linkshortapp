import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
	const { userId } = await auth();

	if (isProtectedRoute(req)) {
		await auth.protect();
	}

	if (userId && req.nextUrl.pathname === '/') {
		return NextResponse.redirect(new URL('/dashboard', req.url));
	}
});

export const config = {
	matcher: ['/((?!_next|.*\\..*).*)'],
};
