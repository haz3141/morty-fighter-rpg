# morty-fighter-rpg

A role playing game where the user selects a character and then fights the remaining characters. Built using HTML, CSS, and the JavaScript library jQuery.

Demo: https://haz3141.github.io/morty-fighter-rpg/

## Dev Tooling

This project uses [pnpm](https://pnpm.io/) for package management and developer tooling.

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm` or via [Corepack](https://pnpm.io/installation#using-corepack))

### Setup

```bash
pnpm install
```

### Available Scripts

| Command                 | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `pnpm run dev`          | Start local dev server at http://localhost:3000 |
| `pnpm run lint`         | Lint JavaScript files in `assets/javascript/`   |
| `pnpm run lint:fix`     | Lint and auto-fix issues                        |
| `pnpm run format`       | Format all HTML, CSS, JS, JSON, and Markdown    |
| `pnpm run format:check` | Check formatting (CI-safe, no modifications)    |

### CI

A GitHub Actions workflow runs lint and format checks on every push/PR to `master`.
