# Card Bookmark Plugin Collaboration Notes

## Project Overview

- This is an Obsidian community plugin focused on card-style bookmarks.
- The entry file is `src/main.ts`, which is bundled into `main.js` at the repository root.
- The plugin currently has three core feature areas:
  - Link bookmarks: `src/link_bookmark.ts`
  - File bookmarks: `src/file_bookmark.ts`
  - File-explorer click interception: `src/file_click_interceptor.ts`
- Settings live in `src/settings.ts`, modals live in `src/modal.ts`, and static assets live in `src/assets/`.
- The required release artifacts are still `main.js`, `manifest.json`, and optional `styles.css`.

## Tech Stack and Build

- Language: TypeScript.
- Bundler: `esbuild`, configured in `esbuild.config.mjs`.
- Package manager: `npm`.
- Dependency: `obsidian` types and runtime API.
- Common scripts:
  - `npm run dev`: watch build
  - `npm run build`: production build
  - `npm run lint`: code check
  - `npm run version`: sync version number and update release-related files

## Directory Conventions

- Keep business logic under `src/` and maintain single responsibility per module.
- `src/main.ts` should only handle plugin lifecycle, settings loading, settings tab registration, and feature composition.
- New features should be split into separate modules instead of being added directly to `main.ts`.
- When adding UI-related logic, prefer reusing the existing organization in `modal.ts`, `settings.ts`, and `src/assets/`.

## Current Implementation Constraints

- The current implementation depends on desktop capabilities:
  - `file_bookmark.ts` uses `FileSystemAdapter`
  - Related logic calls `electron`'s `shell.openPath`
- Therefore, any new or modified file opening, revealing, or external-app launch behavior should be designed as desktop-only. If mobile support is needed, the implementation and compatibility strategy must be updated together.
- The markdown code block processor names are stable conventions and currently include:
  - `link_bookmark_block`
  - `file_bookmark_block`
- Settings field names are also stable conventions and should not be renamed casually:
  - `isEnableFileClickInterceptFeature`
  - `isEnableFileDoubleInterceptFeature`
  - `blockedFileExtensions`

## Modification Principles

- Read the surrounding context before editing code to avoid guesswork.
- Only make changes directly related to the current task; avoid incidental refactors.
- Keep existing naming, code style, and file boundaries consistent.
- If the root cause is clear, fix the root cause instead of only addressing symptoms.
- For cross-module or cross-directory refactors, ask the user for approval first.
- Do not modify files, configuration, or logic unrelated to the task.

## Commands and Tools

- Prefer existing scripts and toolchains instead of introducing temporary dependencies.
- Prefer non-interactive commands.
- Read-only checks such as viewing files, searching code, and reviewing diffs are generally allowed by default.
- Do not run releases, pushes, merges, history rewrites, deletions, or other high-risk operations unless explicitly requested.
- Do not install dependencies from the network or modify lockfiles without approval.

## Validation Guidance

- After changes, prefer the smallest relevant validation first.
- Common code-related validation order:
  1. `npm run lint`
  2. `npm run build`
- If validation is not run, state that clearly in the final response.

## Manifest and Versioning

- Keep `id`, `name`, `version`, `minAppVersion`, `description`, and `isDesktopOnly` in `manifest.json` accurate.
- The existing plugin ID is a stable configuration and should not be changed casually.
- Before a release, keep `manifest.json` and version-related files in sync so the build artifacts remain consistent.

## Security and Privacy

- Default to local/offline behavior and avoid unnecessary network requests.
- Do not add telemetry, hidden reporting, or remote code execution.
- Only read and write what is necessary inside the vault; do not extend access outside the vault.
- If you add external services, data transfer, or permission-related behavior, document it clearly in code and docs.

## Communication

- Default to Chinese in responses.
- When describing changes, lead with the result and then include the affected files and validation status.
- Use explicit file paths when referencing files.
- If there are unvalidated items, risks, or assumptions, state them directly and do not present them as confirmed facts.

