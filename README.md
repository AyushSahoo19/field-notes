# Field Notes

Field Notes is Ayush Kumar Sahoo’s engineering portfolio and learning notebook. It brings together work in industrial sensing, AI systems, and applied mathematics, alongside interactive study maps and planning tools.

[Open Field Notes on GitHub Pages](https://ayushsahoo19.github.io/field-notes/).

## Explore the site

- **Home** (`/`) presents the portfolio, work, and experiments.
- **Career Learning Atlas** (`/learning`) includes learning tracks, a master roadmap, and a role matrix.
- **Domain Map** (`/learning/domain-map`) connects career domains and hosts the AI Stack Atlas, Avenra AI, and The Forge.
- **Project Studio** (`/projects`) collects project write-ups and interactive work.
- **Frameworks** (`/frameworks`) includes the Life Boxes planner (`/frameworks/life-boxes`). The planner and learning checklists save progress in the browser.

The paths above are routes on the running site. Open them using the local server URL below.

## Run locally

Install Node.js 22.13 or later and npm. GitHub CI uses Node.js 24.

```sh
npm run install:ci
npm run dev
```

Open [localhost:5173](http://localhost:5173). In Windows PowerShell, use `npm.cmd` if execution policy blocks the npm script shim. The portfolio runs locally without credentials or a database.

## Verify a change

```sh
npm run lint
npm run build
npm start
```

The last command previews the production Worker locally. Open the URL it prints. GitHub Actions runs the locked install, lint, and build on pull requests and pushes to `main`.

## Source layout

- `app/` contains the React pages, styles, and server routes.
- `app/learning/domain-map/documents/` contains the HTML served by the three atlas routes.
- `components/`, `hooks/`, and `lib/` contain shared UI and utilities.
- `public/` contains static assets.
- `worker/`, `vite.config.ts`, and `.openai/hosting.json` configure the Cloudflare Worker and Sites runtime.
- `db/`, `drizzle/`, and `examples/d1/` contain optional database scaffolding. D1 and R2 bindings are currently disabled.

## Deployment

Pushes to `main` deploy to GitHub Pages. The [Pages workflow](.github/workflows/pages.yml) builds Vinext with the GitHub Pages URL prefix, renders the portfolio, learning tracks, and atlas documents to HTML, and uploads `dist/pages/`. Browser-side interactions and local storage are available on the static site.

To reproduce the static export in PowerShell, set the prefix before building and leave it set for the export command.

```powershell
$env:NEXT_PUBLIC_PAGES_BASE = "/field-notes"
npm.cmd run build
node scripts/export-pages.mjs
Remove-Item Env:NEXT_PUBLIC_PAGES_BASE
```

The regular build still generates the Cloudflare Worker for local preview with `npm start`.
