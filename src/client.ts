import { operationAliases, operations } from './api/operations.js';
import { DivessiInputError } from './errors.js';
import { Transport } from './transport.js';
import type { BoundOperation } from './operation.js';
import type {
  ApiResponse,
  CallOptions,
  ClientOptions,
  JsonValue,
  OperationTransport,
} from './types.js';
import type { GearImageData, ProfileImageData, SiteImageData } from './api/models.js';

export type SaveImageInput =
  | { type: 'gear'; json_data: GearImageData }
  | { type: 'user_with_check'; json_data: ProfileImageData }
  | { type: 'divesite'; json_data: SiteImageData };
type BoundOperations = {
  [K in keyof typeof operationAliases]: BoundOperation<(typeof operationAliases)[K]>;
};
export type DivessiClient = Transport &
  BoundOperations & {
    save_image(
      input: SaveImageInput,
      options?: Omit<CallOptions<JsonValue>, 'decode'>,
    ): Promise<ApiResponse<JsonValue>>;
  };

/** Dispatch to the observed image variant, preserving its query/form placement. */
export function save_image(
  client: OperationTransport,
  input: SaveImageInput,
  options?: Omit<CallOptions<JsonValue>, 'decode'>,
): Promise<ApiResponse<JsonValue>> {
  const name =
    input.type === 'gear'
      ? 'saveGearImage'
      : input.type === 'user_with_check'
        ? 'profileImageUpload'
        : input.type === 'divesite'
          ? 'siteImageUpload'
          : undefined;
  if (!name)
    throw new DivessiInputError('save_image', 'type', 'gear, user_with_check, or divesite');
  return client.execute(name, operations[name], { json_data: input.json_data }, options);
}

/** Create an isolated, in-memory session. Call functions as methods or use named exports. */
export function createClient(options: ClientOptions = {}): DivessiClient {
  const client = new Transport(options);
  const bound: Record<string, unknown> = {};
  for (const [alias, name] of Object.entries(operationAliases)) {
    bound[alias] = (input: object | undefined, callOptions?: CallOptions<unknown>) =>
      client.execute(name, operations[name], input, callOptions);
  }
  bound.save_image = (
    input: SaveImageInput,
    callOptions?: Omit<CallOptions<JsonValue>, 'decode'>,
  ) => save_image(client, input, callOptions);
  return Object.assign(client, bound) as unknown as DivessiClient;
}
