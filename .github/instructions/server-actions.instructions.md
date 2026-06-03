---
description: Use these instructions when implementing or modifying data mutation flows, server actions, and write operations in TypeScript/TSX files.
applyTo: '**/*.{ts,tsx}'
---

# Server Actions — Data Mutations

All data mutations in this app must be implemented via Server Actions.

## Rules

- Always perform create/update/delete operations through Server Actions.
- Server Actions must be called from Client Components.
- Server Action files must be named `actions.ts` and colocated with the component that calls them.
- Define explicit TypeScript input types for Server Actions. Never use `FormData` as the action input type.
- Validate all action inputs with Zod inside the Server Action before business logic.
- At the start of every Server Action, verify that a user is logged in before any database operation.
- Never run Drizzle queries directly inside Server Actions.
- Always perform database operations via helper functions from the `/data` directory that wrap Drizzle queries.
- Server Actions must not throw runtime errors for expected failures. Return a typed result object instead.
- Always return either a success or error payload, for example: `{ success: true, data }` or `{ success: false, error }`.

## Action Result Contract

- Prefer a shared result shape for all actions, such as:
    - success branch with `success: true` and optional `data`
    - error branch with `success: false` and a user-safe `error` message
- Handle validation, auth, and database failures by returning the error branch, not by throwing.
