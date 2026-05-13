---
applyTo: '**/*.{ts,tsx}'
---

# Authentication — Clerk

All authentication in this app is handled exclusively by **Clerk** (`@clerk/nextjs` v7). No other authentication method, library, or custom implementation is permitted.

## Rules

- **Never** implement custom auth logic (JWT handling, session management, password hashing, etc.).
- **Never** use NextAuth, Auth.js, Supabase Auth, or any other auth provider.
- Use only Clerk's hooks, helpers, and components for any auth-related functionality.

## Route Protection

- `/dashboard` is a protected route — users must be signed in to access it.
- Unauthenticated users attempting to visit `/dashboard` must be redirected to the sign-in flow.
- Authenticated users visiting the homepage (`/`) must be redirected to `/dashboard`.

Enforce this via Clerk's `middleware.ts` using `clerkMiddleware` and `createRouteMatcher`:

```ts
// middleware.ts
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
```

## Sign-in / Sign-out UI

- Sign-in and sign-out must always be presented in a **modal**, never as a full-page redirect.
- Use Clerk's `<SignInButton mode="modal">` and `<SignOutButton>` components.
- Do **not** use dedicated `/sign-in` or `/sign-up` pages unless explicitly required.

```tsx
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";

<SignedOut>
  <SignInButton mode="modal">
    <button>Sign in</button>
  </SignInButton>
</SignedOut>

<SignedIn>
  <SignOutButton>
    <button>Sign out</button>
  </SignOutButton>
</SignedIn>
```
