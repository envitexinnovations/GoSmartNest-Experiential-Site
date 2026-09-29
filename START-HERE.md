# GoSmartNest — complete website source

Includes the latest published website, including the curtain bar update, all room scenes, interactions, logo, textures and wildlife video.

## Run locally

Install Node.js 22.13 or newer, then open a terminal in this folder and run:

```sh
npm ci
npm run dev
```

Open http://localhost:5173 in your browser.

## Check and build

```sh
npm run lint
npx tsc --noEmit
npm run build
```

## Main files

- app/page.tsx: landing page and branding
- app/globals.css: styling and animations
- components/tour/: room scenes and interactive controls
- data/: tour content and configuration
- public/: all images, textures, logo and video
- public/tour/credits.txt: media credits

Dependencies and generated build caches are excluded; npm ci installs dependencies from the included lockfile. The project uses React, TypeScript and Vinext/Vite with Sites hosting configuration. Keep the included hidden configuration files when copying the project.
