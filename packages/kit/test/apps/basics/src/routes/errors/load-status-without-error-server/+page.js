import { error } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Load} */
export async function load() {
	throw error(401, undefined);
}
