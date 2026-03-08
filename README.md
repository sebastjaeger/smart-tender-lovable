# Overview

This is the frontend of the Smart Tender application.

## Backend Client

The frontend needs to communicate with a backend. The code / client for how to
communicate with the backend can be found in frontend/src/client. Descriptions of the
endpoints can also be found there.

## Commands

The following commands using `just` (cf. the [justfile][./justfile]) are provided for convenience:

- `just install` - Install dependencies for both backend and frontend
- `just check` - Run all checks (linting, formatting, type checking)
- `just test` - Run all tests
- `just dev` - Start complete development environment with tmux

Similarly, the commands can be run using npm:

- `npm install`
- `npm run check`
- `npm run test`
- `npm run dev`

## Coding Guidelines

When making code changes, always stay consistent with the existing code. Write elegant
code that is as simple as appropriate.
