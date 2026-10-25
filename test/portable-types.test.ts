// A React Native-style global declaration set: no DOM or Node type libraries.
import {
  createClient,
  decodeJsonField,
  encodeJsonField,
  type FetchLike,
  type DiveRecord,
} from 'divessi-client';
declare global {
  interface AbortSignal {
    readonly aborted: boolean;
  }
}
declare const nativeFetch: (
  url: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
  },
) => Promise<{
  status: number;
  headers: { forEach(callback: (value: string, key: string) => void): void };
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
}>;
const compatible: FetchLike = nativeFetch;
const client = createClient({ fetch: compatible, responseValidation: 'lenient' });
const records: DiveRecord[] = decodeJsonField('DiveLog', 'odin_user_log_diveSamples', '[]');
const text: string = encodeJsonField('DiveLog', 'odin_user_log_diveSamples', records);
void text;
async function check() {
  const response = await client.get_divelog();
  const depth: number | null | undefined =
    response.data.logbook_details?.[0]?.odin_user_log_depth_m;
  const catalogue: ArrayBuffer = (await client.initialSites()).data;
  void [depth, catalogue];
}
void check;
