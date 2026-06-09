---
description: This file describes the UI component guidelines for the project, specifically regarding the use of shadcn/ui components.
applyTo: "**/*.{ts,tsx}"
---

# UI Components — shadcn/ui

All UI in this app is built exclusively with **shadcn/ui** components. No custom UI components are permitted.

## Rules

- **Never** create custom UI components (buttons, inputs, dialogs, cards, etc.).
- **Always** use shadcn/ui components from the `components/ui/` directory.
- If a needed component does not exist yet, add it via the shadcn CLI (`npx shadcn@latest add <component>`), then use it.
- Do **not** wrap shadcn components in additional abstraction layers unless strictly necessary for business logic.
- Styling customization must be done via Tailwind CSS utility classes passed through the `className` prop — never by modifying component source files directly.

## Adding Components

```bash
npx shadcn@latest add <component-name>
```

Components are installed into `components/ui/` and can be imported directly:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
```

## Theme

The active theme is `radix-nova`. Do not switch or override the theme.
