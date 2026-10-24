import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

function runExample(name, args, responses, credentials = { DIVESSI_TOKEN: 'mock-token' }) {
  const hook = `
    import assert from 'node:assert/strict';
    const responses = ${JSON.stringify(responses)};
    globalThis.fetch = async (url, init) => {
      const next = responses.shift();
      assert.ok(next, 'Unexpected request; real network access is disabled');
      const query = new URL(url).searchParams;
      assert.equal(query.get('what'), next.action);
      if (next.action !== 'authenticate') assert.equal(query.get('token'), 'mock-token');
      if (next.dive) {
        const body = JSON.parse(new URLSearchParams(init.body).get('json_data'));
        assert.deepEqual(body, next.dive);
        assert.equal(init.method, 'POST');
      }
      return new Response(JSON.stringify(next.body));
    };
    process.on('exit', () => assert.equal(responses.length, 0, 'Missing expected requests'));
  `;
  return spawnSync(
    process.execPath,
    [
      '--import',
      `data:text/javascript,${encodeURIComponent(hook)}`,
      `examples/${name}.ts`,
      ...args,
    ],
    {
      cwd: new URL('../', import.meta.url),
      env: { PATH: process.env.PATH, ...credentials },
      encoding: 'utf8',
    },
  );
}

await test('reading dives logs in, excludes deleted records, and decodes selected samples', () => {
  const result = runExample(
    'read-dives',
    ['17'],
    [
      { action: 'authenticate', body: { authenticated: true, token: 'mock-token' } },
      {
        action: 'get_divelog',
        body: {
          logbook_details: [
            {
              odin_user_log_id: 17,
              odin_user_log_comment: 'Visible reef',
              odin_user_log_depthDataset: '[0,-18.5,null]',
            },
            {
              odin_user_log_id: 18,
              odin_user_log_deleted: true,
              odin_user_log_comment: 'Hidden dive',
            },
          ],
        },
      },
    ],
    { DIVESSI_LOGIN: 'example.invalid', DIVESSI_PASSWORD: 'example-password' },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Visible reef/);
  assert.doesNotMatch(result.stdout, /Hidden dive/);
  assert.match(result.stdout, /-18.5/);
});

await test('reading a missing logbook reports failure without dumping the business response', () => {
  const result = runExample(
    'read-dives',
    [],
    [{ action: 'get_divelog', body: { error_message: 'private server detail' } }],
  );
  assert.equal(result.status, 1);
  assert.doesNotMatch(result.stderr, /private server detail|mock-token/);
});

await test('creating a dive sends a new server record and reads it back without retrying', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'divessi-example-'));
  const dive = {
    odin_user_log_id: null,
    odin_user_log_date: '2026-10-24',
    odin_user_log_entry_time: '09:30',
    odin_user_log_depth_m: 18.5,
    odin_user_log_divetime: 42,
  };
  try {
    const path = join(temp, 'dive.json');
    await writeFile(
      path,
      JSON.stringify({
        ...dive,
        internalPk: 10,
        needsUpload: true,
        localSiteId: 5,
        localBuddyIds: [3],
      }),
    );
    const responses = (records) => [
      { action: 'get_divelog', body: { logbook_details: [] } },
      { action: 'save_divelog', body: { result: 'ok', odin_user_log_id: 17 }, dive },
      { action: 'get_divelog', body: { logbook_details: records } },
    ];
    const accepted = runExample(
      'create-dive',
      [path],
      responses([{ ...dive, odin_user_log_id: 17 }]),
    );
    assert.equal(accepted.status, 0, accepted.stderr);
    assert.match(accepted.stdout, /17/);
    const uncertain = runExample('create-dive', [path], responses([]));
    assert.equal(uncertain.status, 1);
    assert.match(uncertain.stderr, /Check your logbook before retrying/);

    await writeFile(path, JSON.stringify({ ...dive, odin_user_log_id: 17 }));
    const existing = runExample('create-dive', [path], []);
    assert.equal(existing.status, 1);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
