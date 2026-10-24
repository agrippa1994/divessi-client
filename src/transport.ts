import { DivessiDecodeError, DivessiHttpError, DivessiInputError } from './errors.js';
import { decodeModel, isJson, isObject, validateInput } from './validation.js';
import type {
  ApiResponse,
  CallOptions,
  ClientMetadata,
  ClientOptions,
  FetchLike,
  FetchRequestInit,
  JsonValue,
  OperationSpec,
  QueryValue,
} from './types.js';

const metadataKeys: readonly (keyof ClientMetadata)[] = [
  'ssiapp',
  'lang',
  'version',
  'appVersion',
  'context',
  'device',
  'deviceName',
  'manufacturer',
  'osVersion',
  'platform',
  'brand',
];
export const CLIENT_USER_AGENT = 'divessi-client/0.1.0';
function mergeHeaders(
  target: Record<string, string>,
  source: Record<string, string> | undefined,
): void {
  for (const [key, value] of Object.entries(source ?? {})) {
    if (
      !/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(key) ||
      typeof value !== 'string' ||
      /[\r\n\0]/.test(value)
    ) {
      throw new TypeError(
        'Request headers must have valid names and string values without line breaks',
      );
    }
    target[key.toLowerCase()] = value;
  }
}
function baseUrl(value: string): string {
  if (
    !/^https?:\/\/[^/?#\s]+(?:\/[^?#\s]*)?$/i.test(value) ||
    /[?#\s]/.test(value) ||
    /^https?:\/\/[^/]*@/.test(value)
  ) {
    throw new TypeError(
      'Base URLs must be HTTP(S), without credentials, query strings, whitespace, or fragments',
    );
  }
  return value.replace(/\/+$/, '');
}
function encodeFields(fields: Readonly<Record<string, QueryValue>>): string {
  return Object.entries(fields)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}
function metadataQuery(metadata: ClientMetadata): Record<string, QueryValue> {
  const result: Record<string, QueryValue> = {};
  for (const key of metadataKeys) {
    const value = metadata[key];
    if (value !== undefined && typeof value !== 'string')
      throw new TypeError(`metadata.${key} must be a string`);
    if (value !== undefined) result[key] = value;
  }
  return result;
}

export class Transport {
  private token: string | undefined;
  private readonly fetcher: FetchLike;
  private readonly apiBase: string;
  private readonly metadata: ClientMetadata;
  private readonly onTokenChange: ClientOptions['onTokenChange'];
  private readonly defaultHeaders: Record<string, string>;
  constructor(options: ClientOptions = {}) {
    this.defaultHeaders = {};
    const userAgent = options.userAgent === undefined ? CLIENT_USER_AGENT : options.userAgent;
    if (userAgent !== null) mergeHeaders(this.defaultHeaders, { 'user-agent': userAgent });
    mergeHeaders(this.defaultHeaders, options.headers);
    const fetcher = options.fetch ?? globalThis.fetch;
    if (typeof fetcher !== 'function')
      throw new TypeError('A fetch implementation must be supplied in this runtime');
    this.fetcher = fetcher.bind(globalThis) as FetchLike;
    this.apiBase = baseUrl(options.apiBaseUrl ?? 'https://api.divessi.com/app');
    this.metadata = { ...options.metadata };
    metadataQuery(this.metadata);
    this.onTokenChange = options.onTokenChange;
    this.setTokenValue(options.token, false);
  }
  getToken(): string | undefined {
    return this.token;
  }
  setToken(token: string | undefined): void {
    this.setTokenValue(token, true);
  }
  clearToken(): void {
    this.setToken(undefined);
  }
  private setTokenValue(token: string | undefined, notify: boolean): void {
    if (token !== undefined && (typeof token !== 'string' || token.length === 0))
      throw new TypeError('Token must be a nonempty string or undefined');
    this.token = token;
    if (notify) this.onTokenChange?.(token);
  }

  /** @internal Use the generated typed functions rather than building transport specs yourself. */
  async execute<T>(
    name: string,
    spec: OperationSpec,
    input: object | undefined,
    options: CallOptions<T> = {},
  ): Promise<ApiResponse<T>> {
    if (spec.binary && options.decode)
      throw new TypeError('JSON decoders cannot be used on binary downloads');
    if (input !== undefined && !isObject(input))
      throw new DivessiInputError(name, '$', 'input object');
    const fields: Record<string, unknown> =
      input === undefined ? {} : (input as Record<string, unknown>);
    for (const key of Object.keys(fields)) {
      if (!Object.prototype.hasOwnProperty.call(spec.inputTypes, key))
        throw new DivessiInputError(name, key, 'a documented parameter');
    }
    for (const key of spec.required) {
      if (fields[key] === undefined || fields[key] === null)
        throw new DivessiInputError(name, key, 'a non-null value');
    }
    for (const [key, type] of Object.entries(spec.inputTypes)) {
      if (fields[key] !== undefined) validateInput(fields[key], type, name, key);
    }
    const query: Record<string, QueryValue> = {
      ...metadataQuery({ ...this.metadata, ...options.metadata }),
      ...spec.defaults,
    };
    const body: Record<string, QueryValue> = {};
    for (const [keys, target] of [
      [spec.query, query],
      [spec.body, body],
    ] as const) {
      for (const key of keys) {
        const value = fields[spec.fieldMap?.[key] ?? key];
        if (value === undefined) continue;
        if (key === 'json_data') {
          if (!isJson(value))
            throw new DivessiInputError(name, key, 'JSON-compatible data without cycles');
          target[key] = JSON.stringify(value);
        } else if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) {
          target[key] = value as QueryValue;
        } else throw new DivessiInputError(name, key, 'query/form scalar');
      }
    }
    if (spec.action) query.what = spec.action;
    if (spec.auth === 'session') {
      const token = options.token === undefined ? this.token : options.token;
      if (token !== null && token !== undefined) query.token = token;
    } else {
      delete query.token;
    }
    // Login requests omit existing session tokens and language metadata.
    if (name === 'login') {
      delete query.token;
      delete query.lang;
    }
    const headers: Record<string, string> = {
      accept: spec.binary ? 'application/zip' : 'application/json, text/plain, */*',
    };
    mergeHeaders(headers, this.defaultHeaders);
    mergeHeaders(headers, options.headers);
    const queryString = encodeFields(query);
    const url = `${this.apiBase}${spec.path ? '/' + spec.path.replace(/^\/+/, '') : ''}${queryString ? '?' + queryString : ''}`;
    const init: FetchRequestInit = { method: spec.method, headers };
    if (spec.method === 'POST') {
      headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      if (spec.body.length) init.body = encodeFields(body);
    }
    if (options.signal !== undefined) init.signal = options.signal;
    const response = await this.fetcher(url, init);
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key.toLowerCase()] = value;
    });
    const success = response.status >= 200 && response.status < 300;
    if (spec.binary && success) {
      return {
        data: (await response.arrayBuffer()) as T,
        status: response.status,
        headers: responseHeaders,
      };
    }
    const text = await response.text();
    let data: JsonValue = text;
    if (!text) data = null;
    else {
      try {
        data = JSON.parse(text) as JsonValue;
      } catch {
        if (success && responseHeaders['content-type']?.includes('json'))
          throw new DivessiDecodeError(name, '$', 'valid JSON');
      }
    }
    if (!success) throw new DivessiHttpError(name, response.status, data);
    const decoded = options.decode ? options.decode(data) : decodeModel<T>(data, spec.output, name);
    if (
      name === 'login' &&
      isObject(data) &&
      data.authenticated === true &&
      typeof data.token === 'string' &&
      data.token.length
    ) {
      this.setToken(data.token);
    }
    return { data: decoded, status: response.status, headers: responseHeaders };
  }
}
