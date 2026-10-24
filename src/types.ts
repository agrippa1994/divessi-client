/** JSON-compatible values. Undefined object properties are omitted on serialization. */
export type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
export interface JsonObject {
  [key: string]: JsonValue | undefined;
}
/** JSON text on the wire. The optional marker documents its decoded type; plain strings remain accepted. */
export type JsonString<T> = string & { readonly __jsonValue?: T };
export type QueryValue = string | number | boolean | null | undefined;
export type Decoder<T> = (value: JsonValue) => T;

/** Minimal fetch surface; no Node, Bun, or React Native imports are required. */
export interface FetchResponse {
  /** HTTP response status code. */
  readonly status: number;
  /** Response headers exposed through the minimal fetch-compatible iterator. */
  readonly headers: { forEach(callback: (value: string, key: string) => void): void };
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
}
export interface FetchRequestInit {
  /** HTTP request method. */
  method: string;
  /** Request headers after defaults and call overrides are applied. */
  headers: Record<string, string>;
  /** Encoded request body, when present. */
  body?: string;
  /** Cancellation signal passed to fetch. */
  signal?: AbortSignal;
}
export type FetchLike = (url: string, init: FetchRequestInit) => Promise<FetchResponse>;
export interface ClientMetadata {
  /** App identity selector. No default is supplied. */
  ssiapp?: string;
  /** Preferred API language code; omitted during login. */
  lang?: string;
  /** Combined platform/app version selector. No default is supplied. */
  version?: string;
  /** Marketing app version. No default is supplied. */
  appVersion?: string;
  /** App context selector. No default is supplied. */
  context?: string;
  /** Host device/model identifier supplied by the caller. */
  device?: string;
  /** Host device name supplied by the caller. */
  deviceName?: string;
  /** Host device manufacturer supplied by the caller. */
  manufacturer?: string;
  /** Host operating-system version supplied by the caller. */
  osVersion?: string;
  /** App platform selector. No default is supplied. */
  platform?: string;
  /** App/service brand selector. No default is supplied. */
  brand?: string;
}
export interface ClientOptions {
  /** Default: divessi-client/0.1.0. Null lets the fetch runtime choose its User-Agent. */
  userAgent?: string | null;
  /** Default request headers; per-call headers take precedence, case-insensitively. */
  headers?: Record<string, string>;
  /** Default: https://api.divessi.com/app. A path prefix is retained. */
  apiBaseUrl?: string;
  /** Initial session token, kept in this client instance. */
  token?: string;
  /** Default app identity and device query values; per-call metadata overrides them. */
  metadata?: ClientMetadata;
  /** Fetch implementation; defaults to the runtime’s global fetch. */
  fetch?: FetchLike;
  /** Called with the new token after successful authenticated login. No persistence by default. */
  onTokenChange?: (token: string | undefined) => void;
}
export interface CallOptions<T> {
  /** Cancellation signal passed to the underlying fetch implementation. */
  signal?: AbortSignal;
  /** Null explicitly omits a stored token for this call. */
  token?: string | null;
  /** App/device query metadata overrides for this request. */
  metadata?: ClientMetadata;
  /** Request-header overrides, matched case-insensitively. Form Content-Type remains controlled by the transport. */
  headers?: Record<string, string>;
  /** Validate/transform the raw response yourself; the inferred result type follows this function. */
  decode?: Decoder<T>;
}
export interface ApiResponse<T> {
  /** Decoded response body, or raw bytes for a binary operation. */
  data: T;
  /** HTTP response status code. */
  status: number;
  /** Response header names normalized to lowercase. */
  headers: Readonly<Record<string, string>>;
}
export interface OperationSpec {
  /** HTTP request method. */
  readonly method: 'GET' | 'POST';
  /** Service-relative request path. */
  readonly path: string;
  /** Configured service that owns this operation. */
  readonly service: 'api';
  /** Fixed what query selector, when present. */
  readonly action?: string;
  /** Parameters encoded in the query string. */
  readonly query: readonly string[];
  /** Parameters encoded in the form body. */
  readonly body: readonly string[];
  /** Fixed/default query values. */
  readonly defaults: Readonly<Record<string, QueryValue>>;
  /** Required operation parameters. */
  readonly required: readonly string[];
  /** Runtime validators for operation inputs. */
  readonly inputTypes: Readonly<Record<string, string>>;
  /** Runtime response model name or binary type. */
  readonly output: string;
  /** Session-query or unauthenticated policy. */
  readonly auth: 'session' | 'none';
  /** Whether a successful response is returned as ArrayBuffer. */
  readonly binary?: boolean;
  /** Maps bracketed wire-form keys to public input properties. */
  readonly fieldMap?: Readonly<Record<string, string>>;
}
export interface OperationTransport {
  execute<T>(
    name: string,
    spec: OperationSpec,
    input: object | undefined,
    options?: CallOptions<T>,
  ): Promise<ApiResponse<T>>;
}
