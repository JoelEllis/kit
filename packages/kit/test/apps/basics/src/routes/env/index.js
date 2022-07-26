import { PRIVATE_STATIC } from '$env/static/private';
import { env } from '$env/dynamic/private';

export function GET() {
	return {
		body: {
			PRIVATE_STATIC,
			PRIVATE_DYNAMIC: env.PRIVATE_DYNAMIC
		}
	};
}
