---
description: Read this file to understand how to fetch data in the project.
---

# Data Fetching Instructions

This document provides guidelines on how to fetch data in our project. Follow these instructions to ensure consistency and efficiency in your data fetching operations.

## 1. Use Server Components for Data Fetching

In Next.js, ALWAYS use Server Components to fetch data. NEVER use Client Components for data fetching.

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in the components.

ALL helper functions in the /data directory should uze Drizzle ORM to fetch data from the database. NEVER use raw SQL queries or other methods to fetch data.
