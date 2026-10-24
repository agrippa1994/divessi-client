import { operations } from './api/operations.js';
import type { OperationInputs, OperationOutputs } from './api/contracts.js';
import type { ApiResponse, CallOptions, Decoder, OperationTransport } from './types.js';

export type OperationName = keyof OperationInputs;
export type Input<K extends OperationName> = OperationInputs[K];
export type Output<K extends OperationName> = OperationOutputs[K];
type PlainOptions<T> = Omit<CallOptions<T>, 'decode'>;
type Args<K extends OperationName> =
  undefined extends Input<K>
    ? [input?: Input<K>, options?: PlainOptions<Output<K>>]
    : [input: Input<K>, options?: PlainOptions<Output<K>>];
export interface BoundOperation<K extends OperationName> {
  (...args: Args<K>): Promise<ApiResponse<Output<K>>>;
  <T>(
    input: Input<K>,
    options: Output<K> extends ArrayBuffer ? never : CallOptions<T> & { decode: Decoder<T> },
  ): Promise<ApiResponse<T>>;
}
export interface StandaloneOperation<K extends OperationName> {
  (client: OperationTransport, ...args: Args<K>): Promise<ApiResponse<Output<K>>>;
  <T>(
    client: OperationTransport,
    input: Input<K>,
    options: Output<K> extends ArrayBuffer ? never : CallOptions<T> & { decode: Decoder<T> },
  ): Promise<ApiResponse<T>>;
}
/** @internal Generated exports use this factory so their signatures cannot drift. */
export function operation<K extends OperationName>(name: K): StandaloneOperation<K> {
  return ((client: OperationTransport, input: object | undefined, options?: CallOptions<unknown>) =>
    client.execute(name, operations[name], input, options)) as StandaloneOperation<K>;
}
