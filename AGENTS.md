<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# LinkShortApp — Project Guidelines

⚠️ **EXTREMELY IMPORTANT!** ⚠️

BEFORE you generate ANY code, you MUST ALWAYS read the relevant instruction files in the `/docs` directory.
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

## Detailed Instructions

Specific conventions are defined in the `/docs` folder as `.instructions.md` files with `applyTo` patterns. ALWAYS refer to the relevant .md file BEFORE generating any code:

| File                                                       | Covers                                               |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| [`/docs/auth.instructions.md`](/docs/auth.instructions.md) | Clerk-only auth, protected routes, modal sign-in/out |
| [`/docs/ui.instructions.md`](/docs/ui.instructions.md)     | shadcn/ui only — no custom components allowed        |
