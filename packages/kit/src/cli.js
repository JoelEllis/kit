import fs from 'fs';
import colors from 'kleur';
import sade from 'sade';
import { load_config } from './core/config/index.js';
import { coalesce_to_error } from '@internal/shared/utils/error';

/** @param {unknown} e */
function handle_error(e) {
	const error = coalesce_to_error(e);

	if (error.name === 'SyntaxError') throw error;

	console.error(colors.bold().red(`> ${error.message}`));
	if (error.stack) {
		console.error(colors.gray(error.stack.split('\n').slice(1).join('\n')));
	}

	process.exit(1);
}

const prog = sade('svelte-kit').version('__VERSION__');

prog
	.command('sync')
	.describe('Synchronise generated files')
	.action(async () => {
		if (!fs.existsSync('svelte.config.js')) {
			console.warn('Missing svelte.config.js — skipping');
			return;
		}

		try {
			const config = await load_config();
			const sync = await import('./core/sync/sync.js');
			sync.all(config);
		} catch (error) {
			handle_error(error);
		}
	});

// TODO remove for 1.0
replace('dev');
replace('build');
replace('preview');
prog
	.command('package')
	.describe('No longer available - use @sveltejs/package instead')
	.action(() => {
		console.error(
			'svelte-kit package has been removed. It now lives in its own npm package. See the PR on how to migrate: https://github.com/sveltejs/kit/pull/5730'
		);
	});

prog.parse(process.argv, { unknown: (arg) => `Unknown option: ${arg}` });

/** @param {string} command */
function replace(command) {
	prog
		.command(command)
		.describe(`No longer available — use vite ${command} instead`)
		.action(async () => {
			const message = `\n> svelte-kit ${command} is no longer available — use vite ${command} instead`;
			console.error(colors.bold().red(message));

			const steps = [
				'Install vite as a devDependency with npm/pnpm/etc',
				'Create a vite.config.js with the @sveltejs/kit/vite plugin (see below)',
				`Update your package.json scripts to reference \`vite ${command}\` instead of \`svelte-kit ${command}\``
			];

			steps.forEach((step, i) => {
				console.error(`  ${i + 1}. ${colors.cyan(step)}`);
			});

			console.error(
				`
				${colors.grey('// vite.config.js')}
				import { sveltekit } from '@sveltejs/kit/vite';

				/** @type {import('vite').UserConfig} */
				const config = {
					plugins: [sveltekit()]
				};

				export default config;

				`.replace(/^\t{4}/gm, '')
			);
			process.exit(1);
		});
}
