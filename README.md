# task-api

Express + PostgreSQL practice backend.

## Purpose

This project is the backend API for the task-learning project. It currently
uses an in-memory task array; PostgreSQL will replace that temporary storage
later.

## Important files

- `src/server.ts` starts the HTTP server.
- `src/app.ts` configures Express and mounts middleware and routes.
- `src/routes/` maps HTTP methods and URLs to controllers.
- `src/controllers/` contains task CRUD behavior.
- `src/middleware/` contains reusable request-processing functions.
- `src/validators/` contains Zod request schemas.
- `tsconfig.json` configures TypeScript compilation.
- `eslint.config.ts` configures code-quality checks.
- `package.json` contains commands and dependencies.
- `pnpm-lock.yaml` records exact installed dependency versions.

## Commands

Run the development server:

```bash
pnpm dev
```

Compile TypeScript:

```bash
pnpm build
```

Run lint checks:

```bash
pnpm lint
```
