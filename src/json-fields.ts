import { jsonFieldSchemas } from './api/model-schemas.js';
import type { JsonFieldTypes } from './api/models.js';
import { DivessiDecodeError, DivessiInputError } from './errors.js';
import { isJson, validateModel } from './validation.js';
import type { JsonString } from './types.js';

type JsonModel = keyof JsonFieldTypes;
const schemas: Readonly<Record<string, Readonly<Record<string, string>>>> = jsonFieldSchemas;
function fieldSchema(model: string, field: string): string {
  const schema = schemas[model]?.[field];
  if (!schema) throw new TypeError('Field has no JSON text schema');
  return schema;
}

/** Decode one JSON-text field without changing the API's wire models. Empty/invalid text throws. */
export function decodeJsonField<M extends JsonModel, F extends keyof JsonFieldTypes[M] & string>(
  model: M,
  field: F,
  text: string,
): JsonFieldTypes[M][F] {
  const type = fieldSchema(model, field);
  const fail = (path: string, expected: string): never => {
    throw new DivessiDecodeError('decodeJsonField', path, expected);
  };
  if (typeof text !== 'string') fail(field, 'JSON text string');
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return fail(field, 'valid JSON text');
  }
  if (!isJson(value)) fail(field, 'finite JSON value');
  validateModel(value, type, fail, field);
  return value as JsonFieldTypes[M][F];
}

/** Validate and encode one field. The enclosing operation still encodes json_data once. */
export function encodeJsonField<M extends JsonModel, F extends keyof JsonFieldTypes[M] & string>(
  model: M,
  field: F,
  value: JsonFieldTypes[M][F],
): JsonString<JsonFieldTypes[M][F]> {
  const type = fieldSchema(model, field);
  const fail = (path: string, expected: string): never => {
    throw new DivessiInputError('encodeJsonField', path, expected);
  };
  if (!isJson(value)) fail(field, 'JSON value without cycles or nonfinite numbers');
  validateModel(value, type, fail, field);
  return JSON.stringify(value) as JsonString<JsonFieldTypes[M][F]>;
}
