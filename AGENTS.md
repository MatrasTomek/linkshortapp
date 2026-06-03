<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# LinkShortApp — Project Guidelines

⚠️ **EXTREMELY IMPORTANT!** ⚠️

Do not skip this step — the `.instructions.md` files contain critical rules and conventions that MUST be followed.

---

URL shortener — users authenticate via Clerk, create short links stored in Neon PostgreSQL, and are redirected when visiting short URLs.

## Tech Stack

| Layer     | Technology                                 |
| --------- | ------------------------------------------ |
| Framework | Next.js 16.2.5 (App Router)                |
| Runtime   | React 19 / TypeScript (strict)             |
| Styling   | Tailwind CSS v4 + shadcn/ui (`radix-nova`) |
| Icons     | lucide-react                               |
| Auth      | Clerk (`@clerk/nextjs` v7)                 |
| ORM       | Drizzle ORM + Neon PostgreSQL              |
| Variants  | `class-variance-authority` (CVA)           |
