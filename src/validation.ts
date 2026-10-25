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

function checkModel(
  value: unknown,
  type: string,
  fail: (field: string, type: string) => never,
  path: string,
  decodeBooleans: boolean,
  lenient = false,
): unknown {
  // Preserve legacy empty strings on API calls; explicit field codecs check the contents.
  if (type.startsWith('json:')) {
    if (typeof value !== 'string') fail(path, 'JSON text string');
    return value;
  }
  if (type === 'unknown' || type === 'JsonValue') {
    if (!isJson(value)) fail(path, 'JSON value');
    return value;
  }
  if (type === 'JsonObject') {
    if (!isObject(value) || !isJson(value)) fail(path, 'JSON object');
    return value;
  }
  if (type.endsWith('[]')) {
    if (!Array.isArray(value)) fail(path, type);
    const decoded: unknown[] = [];
    (value as unknown[]).forEach((item, i) => {
      try {
        decoded.push(
          checkModel(item, type.slice(0, -2), fail, `${path}[${i}]`, decodeBooleans, lenient),
        );
      } catch (error) {
        if (!lenient || !(error instanceof DivessiDecodeError)) throw error;
      }
    });
    return decodeBooleans ? decoded : value;
  }
  if (type === 'identifier' || type === 'scalar') {
    if (typeof value !== 'string' && !(typeof value === 'number' && Number.isFinite(value)))
      fail(path, 'string or finite number');
    return value;
  }
  if (type.endsWith('?')) {
    return value === null
      ? value
      : checkModel(value, type.slice(0, -1), fail, path, decodeBooleans, lenient);
  }
  if (type === 'boolean' && decodeBooleans) {
    if (value === 0 || value === '0' || value === 'false') return false;
    if (value === 1 || value === '1' || value === 'true') return true;
  }
  if (type === 'string' || type === 'number' || type === 'boolean') {
    if (typeof value !== type || (type === 'number' && !Number.isFinite(value))) fail(path, type);
    return value;
  }
  const schema = schemas[type];
  if (!schema) throw new Error(`Unknown model schema: ${type}`);
  if (!isObject(value)) fail(path, type);
  const result = decodeBooleans ? { ...(value as JsonObject) } : (value as JsonObject);
  for (const [key, fieldType] of Object.entries(schema)) {
    const field = (value as JsonObject)[key];
    if (field !== undefined && field !== null) {
      try {
        const decoded = checkModel(
          field,
          fieldType,
          fail,
          `${path}.${key}`,
          decodeBooleans,
          lenient,
        );
        if (decodeBooleans) result[key] = decoded as JsonValue;
      } catch (error) {
        if (!lenient || !(error instanceof DivessiDecodeError)) throw error;
        delete result[key];
      }
    }
  }
  return result;
}

/** Validate modeled fields and retain additional JSON fields without coercing inputs. */
export function validateModel(
  value: unknown,
  type: string,
  fail: (field: string, type: string) => never,
  path = '$',
): void {
  checkModel(value, type, fail, path, false);
}
export function decodeModel<T>(
  value: JsonValue,
  type: string,
  operation: string,
  validation: ResponseValidation = 'lenient',
): T {
  return checkModel(
    value,
    type,
    (field, expected) => {
      throw new DivessiDecodeError(operation, field, expected);
    },
    '$',
    true,
    validation === 'lenient',
  ) as T;
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
