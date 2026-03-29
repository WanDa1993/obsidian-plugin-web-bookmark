# Card Bookmark

Card Bookmark is an Obsidian plugin for creating card-style bookmarks for links and vault files.

It provides two bookmark types:

- Link bookmarks: insert a code block for a URL and render it as a card.
- File bookmarks: insert a code block for a vault file path and render it as a card.

The plugin also includes an optional file-explorer click interceptor for blocking single-click or double-click opening of selected file types.

## Features

- Create a link bookmark from a URL.
- Create a file bookmark from a vault-relative path.
- Render bookmark blocks as styled cards in Reading view.
- Copy the link or title from a bookmark card through the context menu.
- Reveal a file in the OS file manager or open it in the associated application from the file bookmark card.
- Block selected file extensions from opening in the file explorer by single click or double click.

## Installation

1. Build the plugin with `npm run build`.
2. Copy `main.js`, `manifest.json`, and `styles.css` into:
   `<Vault>/.obsidian/plugins/obsidian-plugin-card-bookmark/`
3. Reload Obsidian and enable the plugin in **Settings → Community plugins**.

## Development

```bash
npm install
npm run dev
```

Common scripts:

- `npm run dev`: watch mode build
- `npm run build`: production build
- `npm run lint`: lint the source
- `npm run version`: bump plugin version and update release metadata

## Usage

### Link bookmark

1. Open the command palette.
2. Run `Add a link bookmark`.
3. Enter an optional title and a valid URL.
4. Insert the generated `link_bookmark_block` code block into your note.

Example:

````markdown
```link_bookmark_block
link: https://example.com
title: Example
```
````

### File bookmark

1. Open the command palette.
2. Run `Add a file bookmark`.
3. Enter an optional title and a vault-relative file path.
4. Insert the generated `file_bookmark_block` code block into your note.

Example:

````markdown
```file_bookmark_block
path: Projects/notes/example.md
title: Example note
```
````

### File click interception

The plugin can block file opening in the file explorer for selected extensions.

- Enable the single-click interceptor to block files on single click.
- Enable the double-click interceptor to block files on double click.
- Enter blocked extensions as a comma-separated list, for example `pdf,zip,apk`.

## Notes

- File reveal and external open actions rely on desktop-only APIs.
- The plugin is designed around Obsidian's local vault data and does not require cloud services.
- Keep bookmark block names stable unless you are intentionally migrating existing notes.

## Project structure

- `src/main.ts`: plugin lifecycle and feature registration
- `src/link_bookmark.ts`: link bookmark command and renderer
- `src/file_bookmark.ts`: file bookmark command and renderer
- `src/file_click_interceptor.ts`: file explorer click interception
- `src/settings.ts`: settings model and settings tab
- `src/modal.ts`: bookmark creation modals
- `src/assets/`: static assets used by the plugin

## Release

When preparing a release:

1. Update `manifest.json` and any version metadata if needed.
2. Run `npm run build`.
3. Publish `main.js`, `manifest.json`, and `styles.css` if present.
