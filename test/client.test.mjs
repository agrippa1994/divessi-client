import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as api from '../dist/esm/index.js';

function mock(body, status = 200, contentType = 'application/json') {
  const calls = [];
  const client = api.createClient({
    token: 'test-session',
    metadata: { lang: 'eng' },
    fetch: async (url, init) => {
      calls.push({ url, init });
      return new Response(contentType.includes('json') ? JSON.stringify(body) : body, {
        status,
        headers: { 'content-type': contentType, 'x-test': 'ok' },
      });
    },
  });
  return { client, calls };
}

void test('login preserves API path, encodes credentials, omits old auth and stores returned token', async () => {
  const { client, calls } = mock({
    authenticated: true,
    token: 'new-session',
    user_email: 'test@example.invalid',
    mid: 7,
  });
  const result = await api.login(client, { l: 'test+one@example.invalid', p: 'a&b?c= d' });
  const url = new URL(calls[0].url);
  assert.equal(url.pathname, '/app/a21.php');
  assert.equal(url.searchParams.get('what'), 'authenticate');
  assert.equal(url.searchParams.get('l'), 'test+one@example.invalid');
  assert.equal(url.searchParams.get('p'), 'a&b?c= d');
  assert.equal(url.searchParams.has('token'), false);
  assert.equal(url.searchParams.has('lang'), false);
  assert.equal(calls[0].init.method, 'GET');
  assert.equal(result.data.authenticated, true);
  assert.equal(result.headers['x-test'], 'ok');
  assert.equal(client.getToken(), 'new-session');
});

void test('typed dive response preserves envelope and nested records', async () => {
  const body = {
    logbook_details: [
      { odin_user_log_id: 4, odin_user_log_depth_m: 21.5, server_extra: 'retained' },
    ],
    logbook_sites: [],
    logbook_history: { 2025: 4 },
  };
  const { client, calls } = mock(body);
  assert.deepEqual((await client.get_divelog()).data, body);
  const params = new URL(calls[0].url).searchParams;
  assert.equal(params.get('what'), 'get_divelog');
  assert.equal(params.get('token'), 'test-session');
  assert.equal(params.get('lang'), 'eng');
});

void test('strict mode rejects malformed modeled response fields', async () => {
  const { client } = mock({ logbook_details: [{ odin_user_log_depth_m: 'deep' }] });
  await assert.rejects(
    client.get_divelog(undefined, { responseValidation: 'strict' }),
    (e) =>
      e instanceof api.DivessiDecodeError &&
      e.field === '$.logbook_details[0].odin_user_log_depth_m',
  );
});

void test('dive response boolean flags normalize explicit wire encodings and preserve other fields', async () => {
  const flags = [false, true, 0, 1, '0', '1', 'false', 'true', null];
  const expected = [false, true, false, true, false, true, false, true, null];
  const { client } = mock({
    logbook_details: [
      ...flags.map((flag) => ({
        odin_user_log_deleted: flag,
        odin_user_log_verified: flag,
        odin_user_log_nr: 1,
        odin_user_log_depthDataset: '[0,1]',
        server_extra: { deleted: '0' },
      })),
      {},
    ],
  });
  const { data } = await client.get_divelog();
  assert.deepEqual(data.logbook_details, [
    ...expected.map((flag) => ({
      odin_user_log_deleted: flag,
      odin_user_log_verified: flag,
      odin_user_log_nr: 1,
      odin_user_log_depthDataset: '[0,1]',
      server_extra: { deleted: '0' },
    })),
    {},
  ]);
});

void test('invalid boolean response encodings retain their decode error path', async () => {
  for (const flag of [2, -1, '', 'yes', 'FALSE', '00', [], {}]) {
    const { client } = mock({ logbook_details: [{ odin_user_log_deleted: flag }] });
    await assert.rejects(client.get_divelog(undefined, { responseValidation: 'strict' }), (e) => {
      assert.ok(e instanceof api.DivessiDecodeError);
      assert.equal(e.field, '$.logbook_details[0].odin_user_log_deleted');
      assert.equal(e.expected, 'boolean');
      return true;
    });
  }
});

void test('response boolean normalization applies to top-level model arrays and login sessions', async () => {
  const gear = mock([{ gearset_deleted: '0', needsUpload: 1 }]);
  const operation = Object.entries(api.operations).find(
    ([, spec]) => spec.output === 'GearSet[]',
  )[0];
  assert.deepEqual((await gear.client[operation]()).data, [
    { gearset_deleted: false, needsUpload: true },
  ]);
  const login = mock({ authenticated: '1', token: 'new-session' });
  assert.equal((await login.client.login({ l: 'user', p: 'pass' })).data.authenticated, true);
  assert.equal(login.client.getToken(), 'new-session');
});

void test('custom decoders receive the original boolean wire encodings', async () => {
  const body = { logbook_details: [{ odin_user_log_deleted: '0' }] };
  const { client } = mock(body);
  const result = await client.get_divelog(undefined, {
    decode(value) {
      assert.deepEqual(value, body);
      return value.logbook_details[0].odin_user_log_deleted;
    },
  });
  assert.equal(result.data, '0');
});

void test('boolean request fields remain strict and are serialized without coercion', async () => {
  const { client, calls } = mock({});
  for (const flag of [0, 1, '0', '1', 'false', 'true']) {
    const dive = { odin_user_log_deleted: flag };
    await assert.rejects(client.save_divelog({ json_data: dive }), api.DivessiInputError);
    assert.equal(dive.odin_user_log_deleted, flag);
  }
  assert.equal(calls.length, 0);
  await client.save_divelog({ json_data: { odin_user_log_deleted: true } });
  assert.deepEqual(JSON.parse(new URLSearchParams(calls[0].init.body).get('json_data')), {
    odin_user_log_deleted: true,
  });
});

void test('save_divelog sends one JSON encoding in a form body and dispatches in query', async () => {
  const { client, calls } = mock({ result: 'ok', dive: {} });
  const dive = {
    odin_user_log_id: 4,
    odin_user_log_depth_m: 21.5,
    odin_user_log_date: '2026-10-24',
    odin_user_log_entry_time: '09:05',
    odin_user_log_comment: 'fish & coral + sun',
  };
  await client.save_divelog({ json_data: dive });
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(
    calls[0].init.headers['content-type'],
    'application/x-www-form-urlencoded; charset=utf-8',
  );
  const query = new URL(calls[0].url).searchParams;
  const form = new URLSearchParams(calls[0].init.body);
  assert.equal(query.get('what'), 'save_divelog');
  assert.equal(query.has('json_data'), false);
  assert.deepEqual(JSON.parse(form.get('json_data')), dive);
  assert.equal(form.has('what'), false);
});

void test('image variants retain their different placement and fixed type values', async () => {
  const { client, calls } = mock({ result: 'ok' });
  await client.save_image({
    type: 'user_with_check',
    json_data: { base64: 'data:image/png;base64,AA==' },
  });
  let query = new URL(calls[0].url).searchParams;
  assert.equal(query.get('type'), 'user_with_check');
  assert.deepEqual(JSON.parse(query.get('json_data')), { base64: 'data:image/png;base64,AA==' });
  assert.equal(calls[0].init.body, undefined);
  await client.save_image({ type: 'gear', json_data: { gear_id: 1, base64: 'AA==' } });
  query = new URL(calls[1].url).searchParams;
  assert.equal(query.get('type'), 'gear');
  assert.equal(JSON.parse(query.get('json_data')).gear_id, 1);
  await client.save_image({
    type: 'divesite',
    json_data: { odin_dive_sites_id: 2, base64: 'AA==' },
  });
  query = new URL(calls[2].url).searchParams;
  assert.equal(query.get('type'), 'divesite');
  assert.equal(query.has('json_data'), false);
  assert.equal(
    JSON.parse(new URLSearchParams(calls[2].init.body).get('json_data')).odin_dive_sites_id,
    2,
  );
});

void test('HTTP errors expose status but do not include credential-bearing URL in their message', async () => {
  const { client } = mock({ error_message: 'denied' }, 401);
  await assert.rejects(
    client.login({ l: 'private@example.invalid', p: 'private-password' }),
    (e) => {
      assert.equal(e.status, 401);
      assert.deepEqual(e.responseBody, { error_message: 'denied' });
      assert.equal(e.message.includes('private'), false);
      assert.equal(e.message.includes('https:'), false);
      return e instanceof api.DivessiHttpError;
    },
  );
  assert.equal(client.getToken(), 'test-session');
});

void test('a validating decoder changes the inferred/body result without hiding HTTP metadata', async () => {
  const { client } = mock({ something: [1, 2, 3] });
  const result = await client.get_vars(undefined, {
    decode(value) {
      if (
        !value ||
        Array.isArray(value) ||
        typeof value !== 'object' ||
        !Array.isArray(value.something)
      )
        throw new Error('invalid lookup');
      return value.something.length;
    },
  });
  assert.equal(result.data, 3);
  assert.equal(result.status, 200);
});

void test('invalid inputs fail before fetching, including unknown parameter names and cyclic JSON', async () => {
  const { client, calls } = mock({});
  await assert.rejects(client.login({ l: 'user' }), api.DivessiInputError);
  await assert.rejects(
    client.login({ l: 'user', p: 'pass', what: 'save_divelog' }),
    api.DivessiInputError,
  );
  await assert.rejects(
    client.save_divelog({ json_data: { odin_user_log_depth_m: 'deep' } }),
    api.DivessiInputError,
  );
  const cyclic = {};
  cyclic.self = cyclic;
  await assert.rejects(client.save_divelog({ json_data: cyclic }), api.DivessiInputError);
  assert.equal(calls.length, 0);
});

void test('per-call auth and cancellation remain isolated from other clients', async () => {
  const { client, calls } = mock({ logbook_details: [], logbook_sites: [] });
  const other = api.createClient({ fetch: async () => new Response('{}') });
  const abort = new AbortController();
  await client.get_divelog(undefined, { token: null, signal: abort.signal });
  assert.equal(new URL(calls[0].url).searchParams.has('token'), false);
  assert.equal(calls[0].init.signal, abort.signal);
  assert.equal(client.getToken(), 'test-session');
  assert.equal(other.getToken(), undefined);
  client.clearToken();
  assert.equal(client.getToken(), undefined);
});

void test('portable transport works with a minimal fetch shim and without URL/URLSearchParams', async () => {
  const { URL: savedURL, URLSearchParams: savedParams, fetch: savedFetch } = globalThis;
  let sent;
  try {
    globalThis.URL = undefined;
    globalThis.URLSearchParams = undefined;
    globalThis.fetch = undefined;
    const client = api.createClient({
      fetch: async (url, init) => {
        sent = { url, init };
        return {
          status: 200,
          headers: {
            forEach(cb) {
              cb('application/json', 'content-type');
            },
          },
          text: async () => '{"authenticated":false}',
          arrayBuffer: async () => new ArrayBuffer(0),
        };
      },
    });
    assert.equal(
      (await client.login({ l: 'rn@example.invalid', p: 'abc' })).data.authenticated,
      false,
    );
    assert.ok(sent.url.startsWith('https://api.divessi.com/app/a21.php?'));
  } finally {
    globalThis.URL = savedURL;
    globalThis.URLSearchParams = savedParams;
    globalThis.fetch = savedFetch;
  }
});

void test('all supported operations have callable named exports and produce transport-valid requests', async () => {
  let calls = 0;
  const client = api.createClient({
    fetch: async () => {
      calls++;
      return new Response('{}', { headers: { 'content-type': 'application/json' } });
    },
  });
  assert.equal(Object.keys(api.operations).length, 36);
  for (const [alias, key] of Object.entries(api.operationAliases)) {
    assert.equal(typeof api[alias], 'function', alias);
    assert.equal(typeof client[alias], 'function', alias);
    assert.ok(api.operations[key]);
  }
  for (const [key, spec] of Object.entries(api.operations)) {
    const input = {};
    for (const field of spec.required) {
      const type = spec.inputTypes[field];
      input[field] =
        type === 'number' || type === 'identifier'
          ? 1
          : type === 'boolean'
            ? false
            : type === 'string' || type === 'scalar'
              ? 'test'
              : {};
    }
    // List-returning contracts receive a list, downloads receive bytes; no live API.
    const transport = api.createClient({
      fetch: async () => {
        calls++;
        return new Response(
          spec.binary ? new Uint8Array([80, 75]) : spec.output.endsWith('[]') ? '[]' : '{}',
          { headers: { 'content-type': spec.binary ? 'application/zip' : 'application/json' } },
        );
      },
    });
    await api[key](transport, Object.keys(spec.inputTypes).length ? input : undefined);
  }
  assert.equal(calls, 36);
});

void test('CommonJS entry is usable independently of the ESM entry', async () => {
  const cjs = createRequire(import.meta.url)('../dist/cjs/index.js');
  assert.equal(typeof cjs.createClient, 'function');
  const client = cjs.createClient({ fetch: async () => new Response('{"user_buddies":[]}') });
  assert.deepEqual((await client.get_buddies()).data.user_buddies, []);
});

void test('JSON field codecs validate structured sample records and keep both wire encoding layers', async () => {
  const samples = [
    {
      n: 1,
      t: 20,
      d: 12.5,
      pr: { t: 0, v: 190 },
      gm: { index: 0, o2: 21 },
      de: { d: 3, t: 60, ty: 0 },
      su: false,
    },
  ];
  const text = api.encodeJsonField('DiveLog', 'odin_user_log_diveSamples', samples);
  assert.deepEqual(api.decodeJsonField('DiveLog', 'odin_user_log_diveSamples', text), samples);
  const { client, calls } = mock({ result: 'ok' });
  await client.save_divelog({
    json_data: { odin_user_log_diveSamples: text, odin_user_log_gear: [2, 3] },
  });
  const payload = JSON.parse(new URLSearchParams(calls[0].init.body).get('json_data'));
  assert.equal(typeof payload.odin_user_log_diveSamples, 'string');
  assert.deepEqual(JSON.parse(payload.odin_user_log_diveSamples), samples);
  assert.deepEqual(payload.odin_user_log_gear, [2, 3]);
  assert.deepEqual(api.decodeJsonField('DiveLog', 'odin_user_log_depthDataset', '[0,null,-12.5]'), [
    0,
    null,
    -12.5,
  ]);
  const nested = api.encodeJsonField('FreeDiveSessionChart', 'depth_set', [-1, -3]);
  assert.deepEqual(
    api.decodeJsonField(
      'DiveLog',
      'odin_user_log_freeDiveSessionCharts',
      JSON.stringify([{ depth_set: nested, dive_time: 30 }]),
    ),
    [{ depth_set: nested, dive_time: 30 }],
  );
});

void test('explicit JSON field decoding rejects malformed text and nested values with precise paths', () => {
  for (const text of ['', '[', '{}', '["deep"]', '[1e999]']) {
    assert.throws(
      () => api.decodeJsonField('DiveLog', 'odin_user_log_depthDataset', text),
      api.DivessiDecodeError,
    );
  }
  assert.throws(
    () => api.decodeJsonField('DiveLog', 'odin_user_log_diveSamples', '[{"pr":{"v":"high"}}]'),
    (e) => e instanceof api.DivessiDecodeError && e.field === 'odin_user_log_diveSamples[0].pr.v',
  );
  assert.throws(
    () => api.encodeJsonField('DiveLog', 'odin_user_log_depthDataset', [NaN]),
    api.DivessiInputError,
  );
  assert.throws(
    () => api.encodeJsonField('DiveLog', 'odin_user_log_diveSamples', [{ t: 'late' }]),
    api.DivessiInputError,
  );
  assert.deepEqual(api.decodeJsonField('SiteDetail', 'current', '{"gentle":12}'), { gentle: 12 });
  assert.throws(() => api.decodeJsonField('SiteDetail', 'current', '[]'), api.DivessiDecodeError);
});

void test('JSON codecs reject sparse arrays before serialization and preserve explicit nullable samples', async () => {
  const gap = [{ n: 1 }, { n: 2 }, { n: 3 }];
  Reflect.deleteProperty(gap, 1);
  const emptySlots = [];
  emptySlots.length = 1;
  for (const samples of [emptySlots, gap]) {
    assert.throws(
      () => api.encodeJsonField('DiveLog', 'odin_user_log_diveSamples', samples),
      api.DivessiInputError,
    );
  }
  const nested = { extra: { samples: [] } };
  nested.extra.samples.length = 2;
  assert.throws(
    () => api.encodeJsonField('DiveLog', 'odin_user_log_diveSamples', [nested]),
    api.DivessiInputError,
  );
  const { client, calls } = mock({});
  await assert.rejects(client.save_divelog({ json_data: nested }), api.DivessiInputError);
  assert.equal(calls.length, 0);
  const explicit = [0, null, -12.5];
  const encoded = api.encodeJsonField('DiveLog', 'odin_user_log_depthDataset', explicit);
  assert.deepEqual(api.decodeJsonField('DiveLog', 'odin_user_log_depthDataset', encoded), explicit);
});

void test('wire decoding preserves legacy empty JSON strings and validates converted collections', async () => {
  const { client } = mock({
    logbook_details: [{ odin_user_log_depthDataset: '', odin_user_log_gear: [1] }],
  });
  assert.equal((await client.get_divelog()).data.logbook_details[0].odin_user_log_depthDataset, '');
  const bad = mock({ logbook_details: [{ odin_user_log_gear: '1,2' }] });
  await assert.rejects(
    bad.client.get_divelog(undefined, { responseValidation: 'strict' }),
    api.DivessiDecodeError,
  );
  const gear = mock([
    {
      gear_images: {
        image: [{ gear_image_url: 'image.jpg' }],
        file: [{ gear_image_url: 'file.jpg' }],
      },
    },
  ]);
  const operation = Object.entries(api.operations).find(([, spec]) => spec.output === 'Gear[]')[0];
  assert.deepEqual((await gear.client[operation]()).data[0].gear_images.image, [
    { gear_image_url: 'image.jpg' },
  ]);
  const badGear = mock([{ gear_images: { image: [42] } }]);
  await assert.rejects(
    badGear.client[operation](undefined, { responseValidation: 'strict' }),
    api.DivessiDecodeError,
  );
});

void test('configured API base paths are retained', async () => {
  const calls = [];
  const client = api.createClient({
    apiBaseUrl: 'https://example.invalid/proxy/app/',
    fetch: async (url) => {
      calls.push(url);
      return new Response('{}', { headers: { 'content-type': 'application/json' } });
    },
  });
  await client.get_vars();
  assert.equal(new URL(calls[0]).pathname, '/proxy/app/a21.php');
  assert.throws(() => api.createClient({ apiBaseUrl: 'https://' }), TypeError);
});

void test('SSI client identity defaults and case-insensitive header overrides are applied', async () => {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response('{}');
  };
  const client = api.createClient({ fetch, headers: { 'X-Client': 'default' } });
  await client.get_divelog();
  assert.equal(calls[0].init.headers['user-agent'], 'Dart/3.12 (dart:io)');
  assert.equal(calls[0].init.headers['user-agent'], api.CLIENT_USER_AGENT);
  const query = new URL(calls[0].url).searchParams;
  assert.equal(query.get('ssiapp'), '0815_IOS');
  assert.equal(query.get('version'), 'IOS_5.0.43');
  assert.equal(query.get('appVersion'), '5.0.43');
  assert.equal(query.get('platform'), 'IOS');
  assert.equal(query.get('brand'), 'SSI');
  assert.equal(query.get('context'), 's');
  await client.get_divelog(undefined, {
    headers: { 'User-Agent': 'caller/1', 'x-CLIENT': 'call' },
    metadata: { lang: 'eng', ssiapp: '0815_ADR', version: 'custom-version' },
  });
  assert.equal(calls[1].init.headers['user-agent'], 'caller/1');
  assert.equal(calls[1].init.headers['x-client'], 'call');
  assert.equal(
    Object.keys(calls[1].init.headers).filter((key) => key.toLowerCase() === 'user-agent').length,
    1,
  );
  assert.equal(new URL(calls[1].url).searchParams.get('lang'), 'eng');
  assert.equal(new URL(calls[1].url).searchParams.get('ssiapp'), '0815_ADR');
  assert.equal(new URL(calls[1].url).searchParams.get('version'), 'custom-version');
  await api.createClient({ fetch, userAgent: null }).get_divelog();
  assert.equal(calls[2].init.headers['user-agent'], undefined);
  await api.createClient({ fetch, userAgent: 'custom/2' }).get_divelog();
  assert.equal(calls[3].init.headers['user-agent'], 'custom/2');
  assert.throws(() => api.createClient({ fetch, userAgent: 'bad\r\nheader' }), TypeError);
});

void test('published operations use only the account API and carry no provenance payloads', () => {
  for (const spec of Object.values(api.operations)) {
    assert.equal(spec.service, 'api');
    assert.ok(['session', 'none'].includes(spec.auth));
    assert.equal(Object.hasOwn(spec, 'evidence'), false);
    if (spec.binary) {
      assert.equal(spec, api.operations.initialSites);
      assert.equal(spec.auth, 'none');
      assert.equal(spec.output, 'ArrayBuffer');
    }
  }
});

void test('initialSites downloads ZIP bytes without a token through both public APIs', async () => {
  const calls = [];
  const archive = new Uint8Array([80, 75, 3, 4]);
  const client = api.createClient({
    token: 'private-session',
    fetch: async (url, init) => {
      calls.push({ url, init });
      return new Response(archive, { headers: { 'content-type': 'application/zip' } });
    },
  });
  const abort = new AbortController();
  const result = await client.initialSites(undefined, { signal: abort.signal });
  assert.ok(result.data instanceof ArrayBuffer);
  assert.deepEqual(new Uint8Array(result.data), archive);
  assert.equal(result.status, 200);
  const url = new URL(calls[0].url);
  assert.equal(url.pathname, '/app/APP_CACHE_SITES.zip');
  assert.equal(url.searchParams.has('token'), false);
  assert.equal(url.searchParams.has('what'), false);
  assert.equal(url.searchParams.get('ssiapp'), '0815_IOS');
  assert.equal(calls[0].init.headers.accept, 'application/zip');
  assert.equal(calls[0].init.signal, abort.signal);
  assert.deepEqual(new Uint8Array((await api.initialSites(client)).data), archive);
  await assert.rejects(client.initialSites(undefined, { decode: () => [] }), TypeError);
  assert.equal(calls.length, 2);
});

void test('initialSites preserves HTTP errors instead of returning error bodies as ZIP bytes', async () => {
  const { client } = mock({ message: 'Unavailable' }, 503);
  await assert.rejects(
    client.initialSites(),
    (error) => error instanceof api.DivessiHttpError && error.status === 503,
  );
});

void test('confirmation identifiers accept numeric and string SSI encodings without coercion', async () => {
  const identifiers = [0, 12345, '', '0', '0012345', '9007199254740993', null];
  const body = {
    logbook_details: identifiers.map((id) => ({
      odin_user_log_nr: 41,
      odin_user_log_user_confirmed_id: id,
      server_extra: 'preserved',
    })),
  };
  const { client } = mock(body);
  assert.deepEqual((await client.get_divelog()).data, body);
});

void test('confirmation identifiers still reject boolean and structured values', async () => {
  for (const id of [false, true, [], {}]) {
    const { client } = mock({ logbook_details: [{ odin_user_log_user_confirmed_id: id }] });
    await assert.rejects(
      client.get_divelog(undefined, { responseValidation: 'strict' }),
      (error) =>
        error instanceof api.DivessiDecodeError &&
        error.field === '$.logbook_details[0].odin_user_log_user_confirmed_id' &&
        error.expected === 'string or finite number',
    );
  }
});

void test('confirmation identifier writes preserve accepted values and reject invalid inputs', async () => {
  const { client, calls } = mock({});
  for (const id of [0, 12345, '0012345', null]) {
    await client.save_divelog({ json_data: { odin_user_log_user_confirmed_id: id } });
    const payload = JSON.parse(new URLSearchParams(calls.at(-1).init.body).get('json_data'));
    assert.equal(payload.odin_user_log_user_confirmed_id, id);
  }
  for (const id of [true, {}, [], Number.NaN, Number.POSITIVE_INFINITY]) {
    await assert.rejects(
      client.save_divelog({ json_data: { odin_user_log_user_confirmed_id: id } }),
      api.DivessiInputError,
    );
  }
  assert.equal(calls.length, 4);
});

void test('lenient defaults keep every dive while omitting incompatible optional fields', async () => {
  const body = {
    logbook_details: Array.from({ length: 13 }, (_, index) => ({
      odin_user_log_nr: index + 1,
      odin_user_log_var_specialdive_id: index === 12 ? 123 : null,
      odin_user_log_depth_m: index === 12 ? 'deep' : 10,
      odin_user_log_deleted: '0',
      extra: { retained: true },
    })),
  };
  const { client } = mock(body);
  const response = await client.get_divelog();
  assert.equal(response.data.logbook_details.length, 13);
  const last = response.data.logbook_details[12];
  assert.equal(last.odin_user_log_nr, 13);
  assert.equal(Object.hasOwn(last, 'odin_user_log_var_specialdive_id'), false);
  assert.equal(Object.hasOwn(last, 'odin_user_log_depth_m'), false);
  assert.equal(last.odin_user_log_deleted, false);
  assert.deepEqual(last.extra, { retained: true });
  assert.deepEqual(response.rawData, body);
  assert.equal(response.rawData.logbook_details[12].odin_user_log_var_specialdive_id, 123);
});

void test('lenient decoding applies recursively and skips only invalid array entries', async () => {
  const { client } = mock({
    logbook_details: [null, 7, { odin_user_log_nr: 5, odin_user_log_buddy_ids: [1, 'bad', 2] }],
    logbook_sites: [{ odin_dive_sites_id: 3, odin_dive_sites_name: 123 }],
  });
  const { data } = await client.get_divelog();
  assert.deepEqual(data.logbook_details, [
    { odin_user_log_nr: 5, odin_user_log_buddy_ids: [1, 2] },
  ]);
  assert.deepEqual(data.logbook_sites, [{ odin_dive_sites_id: 3 }]);
});

void test('response mode supports strict opt-in and per-call overrides', async () => {
  const client = api.createClient({
    responseValidation: 'strict',
    fetch: async () => Response.json({ logbook_details: [{ odin_user_log_depth_m: 'deep' }] }),
  });
  await assert.rejects(client.get_divelog(), api.DivessiDecodeError);
  assert.deepEqual((await client.get_divelog(undefined, { responseValidation: 'lenient' })).data, {
    logbook_details: [{}],
  });
  assert.throws(() => api.createClient({ responseValidation: 'disabled' }), TypeError);
  await assert.rejects(
    client.get_divelog(undefined, { responseValidation: 'disabled' }),
    TypeError,
  );
});

void test('lenient decoding still rejects unusable response envelopes and HTTP failures', async () => {
  const envelope = mock('unexpected body');
  await assert.rejects(envelope.client.get_divelog(), api.DivessiDecodeError);
  const http = mock({ error_message: 'Unavailable' }, 503);
  await assert.rejects(http.client.get_divelog(), api.DivessiHttpError);
});

void test('custom decoders receive unmodified fields regardless of response mode', async () => {
  const { client } = mock({ logbook_details: [{ odin_user_log_depth_m: 'deep' }] });
  const response = await client.get_divelog(undefined, {
    responseValidation: 'strict',
    decode(value) {
      return value.logbook_details[0].odin_user_log_depth_m;
    },
  });
  assert.equal(response.data, 'deep');
  assert.equal(response.rawData.logbook_details[0].odin_user_log_depth_m, 'deep');
});

void test('rawData stays independent of edits to modeled and unknown nested response data', async () => {
  const body = {
    logbook_details: [
      {
        odin_user_log_deleted: '0',
        odin_user_log_buddy_ids: [1, 2],
        server_extra: { notes: ['original', null] },
      },
    ],
    logbook_history: { 2025: 4 },
  };
  for (const responseValidation of ['lenient', 'strict']) {
    const { client } = mock(body);
    const response = await client.get_divelog(undefined, { responseValidation });
    response.data.logbook_details[0].odin_user_log_buddy_ids.push(3);
    response.data.logbook_details[0].server_extra.notes[0] = 'edited';
    response.data.logbook_history[2025] = 99;
    assert.deepEqual(response.rawData, body);
    response.rawData.logbook_details[0].server_extra.notes[1] = 'raw edit';
    assert.equal(response.data.logbook_details[0].server_extra.notes[1], null);
  }
});

void test('custom decoder mutations leave the original rawData intact', async () => {
  const body = {
    logbook_details: [{ odin_user_log_depth_m: 10, extra: { note: 'original' } }],
  };
  const { client } = mock(body);
  const response = await client.get_divelog(undefined, {
    decode(value) {
      delete value.logbook_details[0].odin_user_log_depth_m;
      value.logbook_details[0].extra.note = 'edited';
      return value;
    },
  });
  assert.deepEqual(response.rawData, body);
  assert.equal(Object.hasOwn(response.data.logbook_details[0], 'odin_user_log_depth_m'), false);
  assert.equal(response.data.logbook_details[0].extra.note, 'edited');
});

void test('unmodeled JSON responses also separate data from rawData', async () => {
  const body = [{ nested: { items: [1, null, 'original'] } }];
  const { client } = mock(body);
  const response = await client.get_vars();
  response.data[0].nested.items[2] = 'edited';
  assert.deepEqual(response.rawData, body);
});

void test('logbook_buddies uses the Buddy model and normalizes legacy boolean flags', async () => {
  const { client } = mock({
    logbook_buddies: [
      {
        id: 7,
        forename: 'Anna',
        lastname: 'Berger',
        city: 'Graz',
        country: 'AUT',
        leader_nr: '001234',
        leader_active: 1,
        favorite: '1',
        deleted: 0,
        extra: { preserved: true },
      },
    ],
  });
  const response = await client.get_divelog();
  assert.deepEqual(response.data.logbook_buddies, [
    {
      id: 7,
      forename: 'Anna',
      lastname: 'Berger',
      city: 'Graz',
      country: 'AUT',
      leader_nr: '001234',
      leader_active: true,
      favorite: true,
      deleted: false,
      extra: { preserved: true },
    },
  ]);
  assert.equal(response.rawData.logbook_buddies[0].favorite, '1');
});

void test('logbook buddies remain optional and tolerate incomplete records', async () => {
  for (const body of [{}, { logbook_buddies: null }, { logbook_buddies: [] }]) {
    const { client } = mock(body);
    assert.deepEqual((await client.get_divelog()).data, body);
  }
  const { client } = mock({
    logbook_buddies: [
      null,
      {
        id: 'bad',
        city: 123,
        country: 'AUT',
        firstname: 'Test',
        leader_nr: 12345,
      },
    ],
  });
  assert.deepEqual((await client.get_divelog()).data.logbook_buddies, [
    {
      country: 'AUT',
      firstname: 'Test',
      leader_nr: 12345,
    },
  ]);
});
