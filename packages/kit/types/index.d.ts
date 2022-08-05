/// <reference types="svelte" />
/// <reference types="vite/client" />

import './ambient.js';

import { CompileOptions } from 'svelte/types/compiler/interfaces';
import {
	AdapterEntry,
	BodyValidator,
	CspDirectives,
	JSONObject,
	JSONValue,
	Logger,
	MaybePromise,
	Prerendered,
	PrerenderOnErrorValue,
	RequestOptions,
	ResponseHeaders,
	RouteDefinition,
	TrailingSlash
} from './private.js';
import { SSRNodeLoader, SSRRoute, ValidatedConfig } from './internal.js';
import { HttpError, Redirect } from '../src/index/private.js';

export interface Adapter {
	name: string;
	adapt(builder: Builder): MaybePromise<void>;
}

export interface Builder {
	log: Logger;
	rimraf(dir: string): void;
	mkdirp(dir: string): void;

	config: ValidatedConfig;
	prerendered: Prerendered;

	/**
	 * Create entry points that map to individual functions
	 * @param fn A function that groups a set of routes into an entry point
	 */
	createEntries(fn: (route: RouteDefinition) => AdapterEntry): Promise<void>;

	generateManifest: (opts: { relativePath: string; format?: 'esm' | 'cjs' }) => string;

	getBuildDirectory(name: string): string;
	getClientDirectory(): string;
	getServerDirectory(): string;
	getStaticDirectory(): string;

	/**
	 * @param dest the destination folder to which files should be copied
	 * @returns an array of paths corresponding to the files that have been created by the copy
	 */
	writeClient(dest: string): string[];
	/**
	 * @param dest
	 */
	writePrerendered(
		dest: string,
		opts?: {
			fallback?: string;
		}
	): string[];
	/**
	 * @param dest the destination folder to which files should be copied
	 * @returns an array of paths corresponding to the files that have been created by the copy
	 */
	writeServer(dest: string): string[];
	/**
	 * @param from the source file or folder
	 * @param to the destination file or folder
	 * @param opts.filter a function to determine whether a file or folder should be copied
	 * @param opts.replace a map of strings to replace
	 * @returns an array of paths corresponding to the files that have been created by the copy
	 */
	copy(
		from: string,
		to: string,
		opts?: {
			filter?: (basename: string) => boolean;
			replace?: Record<string, string>;
		}
	): string[];
}

export interface Config {
	compilerOptions?: CompileOptions;
	extensions?: string[];
	kit?: KitConfig;
	preprocess?: any;
}

export interface KitConfig {
	adapter?: Adapter;
	alias?: Record<string, string>;
	appDir?: string;
	browser?: {
		hydrate?: boolean;
		router?: boolean;
	};
	csp?: {
		mode?: 'hash' | 'nonce' | 'auto';
		directives?: CspDirectives;
		reportOnly?: CspDirectives;
	};
	env?: {
		publicPrefix: string;
	};
	moduleExtensions?: string[];
	files?: {
		assets?: string;
		hooks?: string;
		lib?: string;
		params?: string;
		routes?: string;
		serviceWorker?: string;
		template?: string;
	};
	inlineStyleThreshold?: number;
	methodOverride?: {
		parameter?: string;
		allowed?: string[];
	};
	outDir?: string;
	package?: {
		dir?: string;
		emitTypes?: boolean;
		exports?(filepath: string): boolean;
		files?(filepath: string): boolean;
	};
	paths?: {
		assets?: string;
		base?: string;
	};
	prerender?: {
		concurrency?: number;
		crawl?: boolean;
		default?: boolean;
		enabled?: boolean;
		entries?: Array<'*' | `/${string}`>;
		onError?: PrerenderOnErrorValue;
		origin?: string;
	};
	serviceWorker?: {
		register?: boolean;
		files?: (filepath: string) => boolean;
	};
	trailingSlash?: TrailingSlash;
	version?: {
		name?: string;
		pollInterval?: number;
	};
}

export interface ExternalFetch {
	(req: Request): Promise<Response>;
}

export interface GetSession {
	(event: RequestEvent): MaybePromise<App.Session>;
}

export interface Handle {
	(input: {
		event: RequestEvent;
		resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>;
	}): MaybePromise<Response>;
}

export interface HandleError {
	(input: { error: Error & { frame?: string }; event: RequestEvent }): void;
}

/**
 * The `(event: LoadEvent) => LoadOutput` `load` function exported from `<script context="module">` in a page or layout.
 *
 * Note that you can use [generated types](/docs/types#generated-types) instead of manually specifying the Params generic argument.
 */
export interface Load<
	Params extends Record<string, string> = Record<string, string>,
	InputData extends Record<string, any> = Record<string, any>,
	OutputData extends Record<string, any> = Record<string, any>
> {
	(event: LoadEvent<Params, InputData>): MaybePromise<OutputData | void>;
}

export interface LoadEvent<
	Params extends Record<string, string> = Record<string, string>,
	Data extends Record<string, any> | null = Record<string, any> | null
> {
	fetch(info: RequestInfo, init?: RequestInit): Promise<Response>;
	params: Params;
	data: JSONObject | null;
	routeId: string | null;
	session: App.Session;
	setHeaders: (headers: ResponseHeaders) => void;
	url: URL;
	parent: () => Promise<Record<string, any>>;
	depends: (...deps: string[]) => void;
}

export interface LoadOutputCache {
	maxage: number;
	private?: boolean;
}

export interface Navigation {
	from: URL;
	to: URL;
}

export interface Page<Params extends Record<string, string> = Record<string, string>> {
	url: URL;
	params: Params;
	routeId: string | null;
	status: number;
	error: Error | null;
}

export interface ParamMatcher {
	(param: string): boolean;
}

export interface RequestEvent<Params extends Record<string, string> = Record<string, string>> {
	clientAddress: string;
	locals: App.Locals;
	params: Params;
	platform: Readonly<App.Platform>;
	request: Request;
	routeId: string | null;
	setHeaders: (headers: ResponseHeaders) => void;
	url: URL;
}

/**
 * A `(event: RequestEvent) => Response` function exported from a +server.js file that corresponds to an HTTP verb (`GET`, `PUT`, `PATCH`, etc) and handles requests with that method.
 *
 * It receives `Params` as the first generic argument, which you can skip by using [generated types](/docs/types#generated-types) instead.
 */
export interface RequestHandler<Params extends Record<string, string> = Record<string, string>> {
	(event: RequestEvent<Params>): MaybePromise<Response>;
}

export interface ResolveOptions {
	ssr?: boolean;
	transformPageChunk?: (input: { html: string; done: boolean }) => MaybePromise<string | undefined>;
}

export type ResponseBody = JSONValue | Uint8Array | ReadableStream | Error;

export class Server {
	constructor(manifest: SSRManifest);
	init(options: ServerInitOptions): void;
	respond(request: Request, options: RequestOptions): Promise<Response>;
}

export interface ServerInitOptions {
	env: Record<string, string>;
}

export interface SSRManifest {
	appDir: string;
	assets: Set<string>;
	mimeTypes: Record<string, string>;

	/** private fields */
	_: {
		entry: {
			file: string;
			imports: string[];
			stylesheets: string[];
		};
		nodes: SSRNodeLoader[];
		routes: SSRRoute[];
		matchers: () => Promise<Record<string, ParamMatcher>>;
	};
}

export interface GET<Params extends Record<string, string> = Record<string, string>> {
	(event: RequestEvent<Params>): MaybePromise<JSONObject>;
}

export interface POST<Params extends Record<string, string> = Record<string, string>> {
	(event: RequestEvent<Params>): MaybePromise<
		| { status?: number; errors: Record<string, string>; location?: never }
		| { status?: never; errors?: never; location: string }
		| void
	>;
}

export interface PUT<Params extends Record<string, string> = Record<string, string>> {
	(event: RequestEvent<Params>): MaybePromise<{
		status?: number;
		errors: Record<string, string>;
	} | void>;
}

export interface PATCH<Params extends Record<string, string> = Record<string, string>> {
	(event: RequestEvent<Params>): MaybePromise<{
		status?: number;
		errors: Record<string, string>;
	} | void>;
}

export interface DELETE<Params extends Record<string, string> = Record<string, string>> {
	(event: RequestEvent<Params>): MaybePromise<void>;
}

export function error(status: number, message?: string): HttpError;
export function redirect(status: number, location?: string): Redirect;
