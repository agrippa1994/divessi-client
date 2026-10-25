/** JSON-compatible values. Undefined object properties are omitted on serialization. */
export type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
export interface JsonObject {
  [key: string]: JsonValue | undefined;
}
/** JSON text on the wire. The optional marker documents its decoded type; plain strings remain accepted. */
export type JsonString<T> = string & { readonly __jsonValue?: T };
export type QueryValue = string | number | boolean | null | undefined;
export type Decoder<T> = (value: JsonValue) => T;
/** Lenient decoding omits incompatible optional fields; strict decoding rejects them. */
export type ResponseValidation = 'lenient' | 'strict';

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
  /** App identity selector. Default: 0815_IOS. */
  ssiapp?: string;
  /** Preferred API language code; omitted during login. */
  lang?: string;
  /** Combined platform/app version selector. Default: IOS_5.0.43. */
  version?: string;
  /** Marketing app version. Default: 5.0.43. */
  appVersion?: string;
  /** App context selector. Default: s. */
  context?: string;
  /** Host device/model identifier supplied by the caller. */
  device?: string;
  /** Host device name supplied by the caller. */
  deviceName?: string;
  /** Host device manufacturer supplied by the caller. */
  manufacturer?: string;
  /** Host operating-system version supplied by the caller. */
  osVersion?: string;
  /** App platform selector. Default: IOS. */
  platform?: string;
  /** App/service brand selector. Default: SSI. */
  brand?: string;
}
export interface ClientOptions {
  /** Default: lenient. Incompatible optional response fields are omitted instead of rejecting the response. */
  responseValidation?: ResponseValidation;
  /** Default: Dart/3.12 (dart:io), required by SSI. Null lets the fetch runtime choose its User-Agent. */
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
  /** Override response validation for this call. Custom decoders control their own validation. */
  responseValidation?: ResponseValidation;
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
  /** Original parsed body for JSON operations, including fields omitted by lenient decoding. Absent for binary downloads. */
  rawData?: JsonValue;
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
