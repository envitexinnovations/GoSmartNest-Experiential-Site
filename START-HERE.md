# GoSmartNest — Vercel version

This package uses standard Next.js. All website source, images, textures, video and interaction code are preserved. Sites/Vinext/Cloudflare build scaffolding has been removed.

## Upload and deploy
1. Replace the old repository contents with this folder's contents. Do not nest this folder inside the repository. Remove the old vite.config.ts, scripts, build, vendor, openai/.openai, db, drizzle, examples and cloudflare-env.d.ts files if they remain from an earlier upload.
2. Ensure package.json, package-lock.json, vercel.json, next.config.ts, app, components and public are at the repository root.
3. In Vercel choose Next.js, Node.js 24.x, and the root containing package.json. Clear stale command overrides. The included vercel.json sets npm ci, npm run build and .next output.
4. Redeploy. No application environment variables are required for this landing page.

## Local commands
Use Node.js 24.x.

```sh
npm ci
npm run dev
```

Open http://localhost:5173.

```sh
npm run lint
npm run build
npm start
```

Production preview runs at http://localhost:3000.

The build now produces .next/routes-manifest.json. Do not create that file manually or commit generated .next files. Media credits are in public/tour/credits.txt. Appliance controls are illustrative browser interactions.
