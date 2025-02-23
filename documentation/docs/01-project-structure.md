---
title: Project Structure
---

A typical SvelteKit project looks like this:

```bash
my-project/
├ src/
│ ├ lib/
│ │ └ [your lib files]
│ ├ params/
│ │ └ [your param matchers]
│ ├ routes/
│ │ └ [your routes]
│ ├ app.html
│ └ hooks.js
├ static/
│ └ [your static assets]
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

You'll also find common files like `.gitignore` and `.npmrc` (and `.prettierrc` and `.eslintrc.cjs` and so on, if you chose those options when running `npm create svelte@latest`).

### Project files

#### src

The `src` directory contains the meat of your project.

- `lib` contains your library code, which can be imported via the [`$lib`](/docs/modules#$lib) alias, or packaged up for distribution using [`svelte-kit package`](/docs/packaging)
- `params` contains any [param matchers](/docs/routing#advanced-routing-matching) your app needs
- `routes` contains the [pages](/docs/routing#pages) and [endpoints](/docs/routing#endpoints) of your application
- `app.html` is your page template — an HTML document containing the following placeholders:
  - `%sveltekit.head%` — `<link>` and `<script>` elements needed by the app, plus any `<svelte:head>` content
  - `%sveltekit.body%` — the markup for a rendered page
  - `%sveltekit.assets%` — a relative path from the page to [`paths.assets`](/docs/configuration#paths)
  - `%sveltekit.nonce%` — a [CSP](/docs/configuration#csp) nonce for manually included links and scripts, if used
- `hooks.js` (optional) contains your application's [hooks](/docs/hooks)
- `service-worker.js` (optional) contains your [service worker](/docs/service-workers)

You can use `.ts` files instead of `.js` files, if using TypeScript.

#### static

Any static assets that should be served as-is, like `robots.txt` or `favicon.png`, go in here.

#### package.json

Your `package.json` file must include `@sveltejs/kit`, `svelte` and `vite` as `devDependencies`.

When you create a project with `npm create svelte@latest`, you'll also notice that `package.json` includes `"type": "module"`. This means that `.js` files are interpreted as native JavaScript modules with `import` and `export` keywords. Legacy CommonJS files need a `.cjs` file extension.

#### svelte.config.js

This file contains your Svelte and SvelteKit [configuration](/docs/configuration).

#### tsconfig.json

This file (or `jsconfig.json`, if you prefer type-checked `.js` files over `.ts` files) configures TypeScript, if you added typechecking during `npm create svelte@latest`. Since SvelteKit relies on certain configuration being set a specific way, it generates its own `.svelte-kit/tsconfig.json` file which your own config `extends`.

#### vite.config.js

A SvelteKit project is really just a [Vite](https://vitejs.dev) project that uses the [`@sveltejs/kit/vite`](/docs/modules#sveltejs-kit-vite) plugin, along with any other [Vite configuration](https://vitejs.dev/config/).

### Other files

#### test

If you choose to add tests during `npm create svelte@latest`, they will go in a `test` directory.

#### .svelte-kit

As you develop and build your project, SvelteKit will generate files in a `.svelte-kit` directory (configurable as [`outDir`](/docs/configuration#outdir)). You can ignore its contents, and delete them at any time (they will be regenerated when you next `dev` or `build`).
