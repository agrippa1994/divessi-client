import { modelSchemas } from './api/model-schemas.js';
import { DivessiDecodeError, DivessiInputError } from './errors.js';
import type { JsonObject, JsonValue, ResponseValidation } from './types.js';

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

type ParseMode = 'validate' | ResponseValidation;
type ParseResult =
  | { valid: true; value: JsonValue }
  | { valid: false; field: string; expected: string };

function mismatch(field: string, expected: string): ParseResult {
  return { valid: false, field, expected };
}

function parseBoolean(value: unknown, mode: ParseMode): unknown {
  if (mode !== 'validate') {
    if (value === 0 || value === '0' || value === 'false') return false;
    if (value === 1 || value === '1' || value === 'true') return true;
  }
  return value;
}

function parseModel(value: unknown, type: string, path: string, mode: ParseMode): ParseResult {
  // Preserve legacy empty strings on API calls; explicit field codecs check the contents.
  if (type.startsWith('json:')) {
    return typeof value === 'string' ? { valid: true, value } : mismatch(path, 'JSON text string');
  }
  if (type === 'unknown' || type === 'JsonValue') {
    return isJson(value) ? { valid: true, value } : mismatch(path, 'JSON value');
  }
  if (type === 'JsonObject') {
    return isObject(value) && isJson(value)
      ? { valid: true, value }
      : mismatch(path, 'JSON object');
  }
  if (type.endsWith('[]')) {
    if (!Array.isArray(value)) return mismatch(path, type);
    const decoded: JsonValue[] = [];
    for (const [i, item] of value.entries()) {
      const parsed = parseModel(item, type.slice(0, -2), `${path}[${i}]`, mode);
      if (parsed.valid) {
        decoded.push(parsed.value);
      } else if (mode !== 'lenient') {
        return parsed;
      }
    }
    return { valid: true, value: decoded };
  }
  if (type === 'identifier' || type === 'scalar') {
    return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value))
      ? { valid: true, value }
      : mismatch(path, 'string or finite number');
  }
  if (type.endsWith('?')) {
    return value === null
      ? { valid: true, value }
      : parseModel(value, type.slice(0, -1), path, mode);
  }
  if (type === 'boolean') {
    const decoded = parseBoolean(value, mode);
    return typeof decoded === 'boolean' ? { valid: true, value: decoded } : mismatch(path, type);
  }
  if (type === 'string') {
    return typeof value === 'string' ? { valid: true, value } : mismatch(path, type);
  }
  if (type === 'number') {
    return typeof value === 'number' && Number.isFinite(value)
      ? { valid: true, value }
      : mismatch(path, type);
  }
  const schema = schemas[type];
  if (!schema) throw new Error(`Unknown model schema: ${type}`);
  if (!isObject(value)) return mismatch(path, type);
  const result = { ...value };
  for (const [key, fieldType] of Object.entries(schema)) {
    const field = value[key];
    if (field !== undefined && field !== null) {
      const parsed = parseModel(field, fieldType, `${path}.${key}`, mode);
      if (parsed.valid) {
        result[key] = parsed.value;
      } else if (mode === 'lenient') {
        delete result[key];
      } else {
        return parsed;
      }
    }
  }
  return { valid: true, value: result };
}

/** Validate modeled fields and retain additional JSON fields without coercing inputs. */
export function validateModel(
  value: unknown,
  type: string,
  fail: (field: string, type: string) => never,
  path = '$',
): void {
  const parsed = parseModel(value, type, path, 'validate');
  if (!parsed.valid) fail(parsed.field, parsed.expected);
}
export function decodeModel<T>(
  value: JsonValue,
  type: string,
  operation: string,
  validation: ResponseValidation = 'lenient',
): T {
  const parsed = parseModel(value, type, '$', validation);
  if (!parsed.valid) throw new DivessiDecodeError(operation, parsed.field, parsed.expected);
  return parsed.value as T;
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
