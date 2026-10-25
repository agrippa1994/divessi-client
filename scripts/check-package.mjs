import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const temp = await mkdtemp(join(tmpdir(), 'divessi-package-'));
try {
  // Match Changesets' pack command, including the prepack build hook.
  const packed = JSON.parse(
    execFileSync('pnpm', ['pack', '--json', '--out', join(temp, 'package.tgz')], {
      cwd: root,
      encoding: 'utf8',
    }),
  );
  const paths = new Set(packed.files.map((file) => file.path));
  for (const path of [
    'dist/esm/index.js',
    'dist/esm/index.d.ts',
    'dist/cjs/index.js',
    'dist/cjs/index.d.ts',
    'dist/cjs/package.json',
    'examples/create-dive.ts',
    'examples/read-dives.ts',
    'examples/session.ts',
    'examples/dive.json',
    'LICENSE',
  ])
    assert.ok(paths.has(path), `Package is missing ${path}`);
  for (const path of paths) {
    assert.ok(
      !/^(?:src|test|scripts|\.github|\.changeset|node_modules)\//.test(path),
      `Unexpected package file: ${path}`,
    );
    assert.ok(!/(?:^|\/)\.env(?:\.|$)/.test(path), `Unexpected environment file: ${path}`);
  }
  await writeFile(join(temp, 'package.json'), '{"private":true,"type":"module"}\n');
  execFileSync(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--package-lock=false',
      packed.filename,
    ],
    { cwd: temp, stdio: 'pipe' },
  );
  const { version } = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  );
  const smoke = `
    import assert from 'node:assert/strict';
    import { createRequire } from 'node:module';
    import * as esm from 'divessi-client';
    const require = createRequire(import.meta.url);
    const cjs = require('divessi-client');
    assert.equal(require('divessi-client/package.json').version, ${JSON.stringify(version)});
    for (const api of [esm, cjs]) {
      assert.equal(api.CLIENT_USER_AGENT, 'Dart/3.12 (dart:io)');
      const client = api.createClient({
        token: 'mock-token',
        fetch: async () => new Response(JSON.stringify({ logbook_details: [] })),
      });
      assert.deepEqual((await client.get_divelog()).data.logbook_details, []);
    }
  `;
  await writeFile(join(temp, 'smoke.mjs'), smoke);
  execFileSync(process.execPath, ['smoke.mjs'], { cwd: temp, stdio: 'inherit' });
  console.log(
    `Verified ${packed.name}@${packed.version}: archive contents, ESM, CommonJS, and package version`,
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
