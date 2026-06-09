---
name: security-audit
description: Perform a security audit and report findings in a structured table; if files are inaccessible, request required inputs.
agent: ask
---

Perform a security audit of this codebase to detect potential security vulnerabilities.

## Output format (required)

Return findings as a markdown table with these columns:

- "ID" (start at 1, auto-increment)
- "Severity"
- "Description"
- "File Path" (must be an actual clickable file link/path)
- "Line Number (s)"
- "Recommendation"

Each row must represent one unique security issue.

## If workspace/code access is unavailable

If you cannot access project files, do **not** fabricate findings.
Instead, return:

1. A brief statement that you cannot perform a real code-level audit without file access.
2. An empty findings table using the required columns.
3. A concise request for the minimum set of files/folders needed to continue (for example: auth config, API routes, middleware, DB access layer, environment/config files, and redirect logic).
