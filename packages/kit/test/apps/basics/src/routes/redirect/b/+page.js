import { redirect } from '@sveltejs/kit/data';

export function load() {
	throw redirect(307, './c');
}
