## Overview

Smart Tender is a web application for analyzing public tenders. Users upload tender
documents into projects and run LLM-powered analyses that extract and summarize key
information. The current project contains the frontend part of the application. The
backend, which is not contained here, exposes a REST API.

## Backend API — Core Concepts

### Domain Model

- **User** — owns projects. Has an analysis quota (`bonus_analyses`) that is
  decremented on each analysis creation. Superusers bypass quotas and can access
  all projects and admin endpoints.
- **Project** — a named container owned by a single user. Holds files and
  analyses.
- **File** — a document (typically PDF) uploaded to a project. Subject to
  server-side validation (extension, size, page count). Files are the input for
  analyses.
- **Analysis** — an LLM-generated evaluation of a project's files. Created as
  `pending`, processed asynchronously (`in_progress`), and ends as `completed`
  or `failed`. Completed analyses contain markdown content and can be exported
  as PDF.

### Relationships

A user owns many projects. Each project contains files and analyses. Analyses
are always scoped to a project and operate on that project's files.

### Typical Workflow

1. Register / log in to obtain a Bearer token.
2. Create a project.
3. Upload one or more files to the project.
4. Create an analysis — this enqueues an async task that processes the files.
5. Poll the analysis until its status is `completed`.
6. Read the analysis content or export it as PDF.

## Backend Client

The frontend needs to communicate with a backend. The code / client for how to do so can
be found in frontend/src/client. Descriptions of the endpoints can be found there as
well.

## Commands

In particular, the following commands are provided for convenience:

- `npm install` - Install dependencies for both backend and frontend
- `npm run check` - Run all checks (linting, formatting, type checking)
- `npm run test` - Run all tests

## Coding Guidelines

When making code changes, always stay consistent with the existing code. Write elegant
and concise code that is as simple as appropriate.
