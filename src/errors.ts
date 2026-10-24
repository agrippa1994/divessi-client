import type { JsonValue } from './types.js';

export class DivessiHttpError extends Error {
  override readonly name = 'DivessiHttpError';
  constructor(
    readonly operation: string,
    readonly status: number,
    readonly responseBody: JsonValue,
  ) {
    // URLs can contain login credentials. Never include a URL or body in the message.
    super(`DiveSSI ${operation} failed with HTTP ${status}`);
  }
}
export class DivessiDecodeError extends Error {
  override readonly name = 'DivessiDecodeError';
  constructor(
    readonly operation: string,
    readonly field: string,
    readonly expected: string,
  ) {
    super(`Invalid DiveSSI ${operation} response at ${field}: expected ${expected}`);
  }
}
export class DivessiInputError extends Error {
  override readonly name = 'DivessiInputError';
  constructor(
    readonly operation: string,
    readonly field: string,
    readonly expected: string,
  ) {
    super(`Invalid DiveSSI ${operation} input at ${field}: expected ${expected}`);
  }
}
