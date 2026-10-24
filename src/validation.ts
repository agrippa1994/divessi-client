import { modelSchemas } from './api/model-schemas.js';
import { DivessiDecodeError, DivessiInputError } from './errors.js';
import type { JsonObject, JsonValue } from './types.js';

const schemas: Readonly<Record<string, Readonly<Record<string, string>>>> = modelSchemas;
export function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function checkJson(value: unknown, seen: Set<object>): boolean {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value !== 'object' || !value || seen.has(value)) return false;
  if (
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) !== Object.prototype &&
    Object.getPrototypeOf(value) !== null
  )
    return false;
  seen.add(value);
  let valid = true;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (!Object.hasOwn(value, i) || !checkJson(value[i], seen)) {
        valid = false;
        break;
      }
    }
  } else {
    valid = Object.values(value).every((item) => item === undefined || checkJson(item, seen));
  }
  seen.delete(value);
  return valid;
}
export function isJson(value: unknown): value is JsonValue {
  return checkJson(value, new Set());
}

/** Validate modeled fields and retain additional JSON fields. */
export function validateModel(
  value: unknown,
  type: string,
  fail: (field: string, type: string) => never,
  path = '$',
): void {
  // Preserve legacy empty strings on API calls; explicit field codecs check the contents.
  if (type.startsWith('json:')) {
    if (typeof value !== 'string') fail(path, 'JSON text string');
    return;
  }
  if (type === 'unknown' || type === 'JsonValue') {
    if (!isJson(value)) fail(path, 'JSON value');
    return;
  }
  if (type === 'JsonObject') {
    if (!isObject(value) || !isJson(value)) fail(path, 'JSON object');
    return;
  }
  if (type.endsWith('[]')) {
    if (!Array.isArray(value)) fail(path, type);
    (value as unknown[]).forEach((item, i) =>
      validateModel(item, type.slice(0, -2), fail, `${path}[${i}]`),
    );
    return;
  }
  if (type === 'identifier' || type === 'scalar') {
    if (typeof value !== 'string' && !(typeof value === 'number' && Number.isFinite(value)))
      fail(path, 'string or finite number');
    return;
  }
  if (type.endsWith('?')) {
    if (value !== null) validateModel(value, type.slice(0, -1), fail, path);
    return;
  }
  if (type === 'string' || type === 'number' || type === 'boolean') {
    if (typeof value !== type || (type === 'number' && !Number.isFinite(value))) fail(path, type);
    return;
  }
  const schema = schemas[type];
  if (!schema) throw new Error(`Unknown model schema: ${type}`);
  if (!isObject(value)) fail(path, type);
  for (const [key, fieldType] of Object.entries(schema)) {
    const field = (value as JsonObject)[key];
    if (field !== undefined && field !== null)
      validateModel(field, fieldType, fail, `${path}.${key}`);
  }
}
export function decodeModel<T>(value: JsonValue, type: string, operation: string): T {
  validateModel(value, type, (field, expected) => {
    throw new DivessiDecodeError(operation, field, expected);
  });
  return value as T;
}
export function validateInput(
  value: unknown,
  type: string,
  operation: string,
  field: string,
): void {
  validateModel(
    value,
    type,
    (path, expected) => {
      throw new DivessiInputError(operation, path, expected);
    },
    field,
  );
}
