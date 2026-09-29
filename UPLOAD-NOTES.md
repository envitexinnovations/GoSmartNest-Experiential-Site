# Corrected source package

Upload the contents of this folder into the repository root, keeping the folder structure.

- Configuration is now openai/hosting.json (a visible folder).
- vite.config.ts explicitly imports ./build/sites-vite-plugin.ts.
- The build plugin reads configuration from the new path.
- TypeScript allows explicit .ts imports.
- Site visuals, controls and assets are unchanged.

Install: npm ci
Run locally: npm run dev
Build: npm run build

This fixes the requested source paths. The project still uses Vinext/Cloudflare output, so it is not a conversion to Vercel's standard Next.js deployment. The plugin's dist/.openai output directory is generated hosting metadata, not a source dependency.
