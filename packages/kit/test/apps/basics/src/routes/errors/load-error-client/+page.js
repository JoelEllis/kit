import { error } from '@sveltejs/kit/data';

/** @type {import('@sveltejs/kit').Load} */
export async function load() {
	if (typeof window !== 'undefined') {
		throw error(555, new Error('Not found'));
	}

	return {};
}
