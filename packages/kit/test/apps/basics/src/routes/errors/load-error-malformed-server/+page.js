import { error } from '@sveltejs/kit/data';

/** @type {import('@sveltejs/kit').Load} */
export async function load() {
	// @ts-expect-error - given value expected to throw
	throw error(555, {});
}
