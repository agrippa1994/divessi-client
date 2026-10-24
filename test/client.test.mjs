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

test('login preserves API path, encodes credentials, omits old auth and stores returned token', async () => {
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

test('typed dive response preserves envelope and nested records', async () => {
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

test('malformed modeled response fields are rejected instead of being cast', async () => {
  const { client } = mock({ logbook_details: [{ odin_user_log_depth_m: 'deep' }] });
  await assert.rejects(
    client.get_divelog(),
    (e) =>
      e instanceof api.DivessiDecodeError &&
      e.field === '$.logbook_details[0].odin_user_log_depth_m',
  );
});

test('save_divelog sends one JSON encoding in a form body and dispatches in query', async () => {
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

test('image variants retain their different placement and fixed type values', async () => {
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

test('HTTP errors expose status but do not include credential-bearing URL in their message', async () => {
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

test('a validating decoder changes the inferred/body result without hiding HTTP metadata', async () => {
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

test('invalid inputs fail before fetching, including unknown parameter names and cyclic JSON', async () => {
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

test('per-call auth and cancellation remain isolated from other clients', async () => {
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

test('portable transport works with a minimal fetch shim and without URL/URLSearchParams', async () => {
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

test('all supported operations have callable named exports and produce transport-valid requests', async () => {
  let calls = 0;
  const client = api.createClient({
    fetch: async () => {
      calls++;
      return new Response('{}', { headers: { 'content-type': 'application/json' } });
    },
  });
  assert.equal(Object.keys(api.operations).length, 35);
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
  assert.equal(calls, 35);
});

test('CommonJS entry is usable independently of the ESM entry', async () => {
  const cjs = createRequire(import.meta.url)('../dist/cjs/index.js');
  assert.equal(typeof cjs.createClient, 'function');
  const client = cjs.createClient({ fetch: async () => new Response('{"user_buddies":[]}') });
  assert.deepEqual((await client.get_buddies()).data.user_buddies, []);
});

test('JSON field codecs validate structured sample records and keep both wire encoding layers', async () => {
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

test('explicit JSON field decoding rejects malformed text and nested values with precise paths', () => {
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

test('JSON codecs reject sparse arrays before serialization and preserve explicit nullable samples', async () => {
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

test('wire decoding preserves legacy empty JSON strings and validates converted collections', async () => {
  const { client } = mock({
    logbook_details: [{ odin_user_log_depthDataset: '', odin_user_log_gear: [1] }],
  });
  assert.equal((await client.get_divelog()).data.logbook_details[0].odin_user_log_depthDataset, '');
  const bad = mock({ logbook_details: [{ odin_user_log_gear: '1,2' }] });
  await assert.rejects(bad.client.get_divelog(), api.DivessiDecodeError);
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
  await assert.rejects(badGear.client[operation](), api.DivessiDecodeError);
});

test('configured API base paths are retained', async () => {
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

test('client identity is transparent and case-insensitive header overrides are applied', async () => {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response('{}');
  };
  const client = api.createClient({ fetch, headers: { 'X-Client': 'default' } });
  await client.get_divelog();
  assert.equal(calls[0].init.headers['user-agent'], 'divessi-client/0.1.0');
  assert.equal(calls[0].init.headers['user-agent'], api.CLIENT_USER_AGENT);
  const query = new URL(calls[0].url).searchParams;
  for (const key of ['ssiapp', 'version', 'appVersion', 'platform', 'brand', 'context'])
    assert.equal(query.has(key), false);
  await client.get_divelog(undefined, {
    headers: { 'User-Agent': 'caller/1', 'x-CLIENT': 'call' },
    metadata: { lang: 'eng' },
  });
  assert.equal(calls[1].init.headers['user-agent'], 'caller/1');
  assert.equal(calls[1].init.headers['x-client'], 'call');
  assert.equal(
    Object.keys(calls[1].init.headers).filter((key) => key.toLowerCase() === 'user-agent').length,
    1,
  );
  assert.equal(new URL(calls[1].url).searchParams.get('lang'), 'eng');
  await api.createClient({ fetch, userAgent: null }).get_divelog();
  assert.equal(calls[2].init.headers['user-agent'], undefined);
  await api.createClient({ fetch, userAgent: 'custom/2' }).get_divelog();
  assert.equal(calls[3].init.headers['user-agent'], 'custom/2');
  assert.throws(() => api.createClient({ fetch, userAgent: 'bad\r\nheader' }), TypeError);
});

test('published operations use only the account API and carry no provenance payloads', () => {
  for (const spec of Object.values(api.operations)) {
    assert.equal(spec.service, 'api');
    assert.ok(['session', 'none'].includes(spec.auth));
    assert.equal(Object.hasOwn(spec, 'evidence'), false);
    assert.equal(Object.hasOwn(spec, 'binary'), false);
  }
});
