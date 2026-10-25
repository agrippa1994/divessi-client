import { createClient, get_divelog, login, type JsonValue, type DiveLog } from 'divessi-client';
const client = createClient({ fetch });
async function check() {
  const auth = await login(client, { l: 'user@example.invalid', p: 'password' });
  const token: string | null | undefined = auth.data.token;
  const dives = await get_divelog(client);
  const depth: number | null | undefined = dives.data.logbook_details?.[0]?.odin_user_log_depth_m;
  const dive: DiveLog = { odin_user_log_depth_m: 22, odin_user_log_date: '2026-10-24' };
  await client.save_divelog({ json_data: dive });
  const raw: JsonValue = (await client.get_vars()).data;
  const size: number = (
    await client.get_vars(undefined, {
      decode(value) {
        return Array.isArray(value) ? value.length : 0;
      },
    })
  ).data;
  const catalogue: ArrayBuffer = (await client.initialSites()).data;
  const confirmedId: string | number | null | undefined =
    dives.data.logbook_details?.[0]?.odin_user_log_user_confirmed_id;
  await client.save_divelog({ json_data: { odin_user_log_user_confirmed_id: 0 } });
  await client.save_divelog({ json_data: { odin_user_log_user_confirmed_id: '00123' } });
  // @ts-expect-error confirmation identifiers cannot be booleans
  void client.save_divelog({ json_data: { odin_user_log_user_confirmed_id: true } });
  void [token, depth, raw, size, catalogue, confirmedId];
  // @ts-expect-error binary downloads cannot use a JSON decoder
  void client.initialSites(undefined, { decode: () => [] });
  // @ts-expect-error credentials are required
  void client.login({ l: 'user' });
  // @ts-expect-error modeled depth is numeric
  void client.save_divelog({ json_data: { odin_user_log_depth_m: 'deep' } });
  // @ts-expect-error typed response fields are not arbitrary strings
  const bad: string = dives.data.logbook_details?.[0]?.odin_user_log_depth_m;
  // @ts-expect-error explicit type arguments cannot bypass a validating decoder
  void client.get_vars<number>();
  // @ts-expect-error unsupported image variant
  void client.save_image({ type: 'avatar', json_data: {} });
  // @ts-expect-error unknown request properties are rejected
  void client.login({ l: 'u', p: 'p', what: 'get_divelog' });
  // @ts-expect-error return type follows decoder, not a claimed generic type
  const wrong: string = (await client.get_vars(undefined, { decode: () => 42 })).data;
  void [bad, wrong];
}
void check;

import {
  decodeJsonField,
  encodeJsonField,
  type DiveRecord,
  type JsonString,
  type GearImages,
} from 'divessi-client';
const records: DiveRecord[] = decodeJsonField('DiveLog', 'odin_user_log_diveSamples', '[]');
const depths: (number | null)[] = decodeJsonField('DiveLog', 'odin_user_log_depthDataset', '[]');
const encoded: JsonString<DiveRecord[]> = encodeJsonField(
  'DiveLog',
  'odin_user_log_diveSamples',
  records,
);
const images: GearImages = {
  image: [{ gear_image_url: 'a.jpg' }],
  file: [{ gear_image_url: 'b.jpg' }],
};
void [records, depths, encoded, images];
// @ts-expect-error decoded data is a numeric array
const _badDepths: string[] = decodeJsonField('DiveLog', 'odin_user_log_depthDataset', '[]');
// @ts-expect-error encoding validates its typed input
encodeJsonField('DiveLog', 'odin_user_log_depthDataset', ['deep']);
// @ts-expect-error only declared encoded JSON fields have codecs
decodeJsonField('DiveLog', 'odin_user_log_comment', '{}');
