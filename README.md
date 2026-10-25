# divessi-client

Unofficial TypeScript client for personal logbook, profile, buddy, equipment, and dive-site operations in the SSI / DiveSSI API.

Independent project. Not affiliated with, endorsed by, or supported by Scuba Schools International or HEAD Watersports. SSI, DiveSSI, and MySSI names identify the compatible service and belong to their respective owners.

- 36 operations, with descriptive names and API-action aliases.
- No runtime dependencies; uses standard `fetch` or a compatible implementation you supply.
- ESM and CommonJS builds with TypeScript declarations.
- Lenient response decoding by default, optional strict validation, JSON-field codecs, cancellation, and isolated in-memory sessions.

This is an unofficial, statically described interface. The public site ZIP and invalid-token logbook responses have been checked against the live service; successful account operations and writes have not been live-verified. The service can change or restrict access at any time. Only access accounts and data you are authorized to use; this project's license does not grant rights to the service or its content.

## Build and install

Requires Node.js 24 and the package manager specified in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm pack
```

Install the resulting archive into your application:

```sh
pnpm add /path/to/divessi-client-0.1.0.tgz
```

## Login and read your logbook

```ts
import { createClient } from 'divessi-client';

const client = createClient({ metadata: { lang: 'eng' } });
const { data: session } = await client.login({
  l: 'your-login',
  p: 'your-password',
});

if (!session.authenticated || !session.token) {
  throw new Error('Login was not accepted');
}

const { data } = await client.get_divelog();
const dives = data.logbook_details ?? [];
```

Successful login stores the returned token in that client instance. `getToken()`, `setToken()`, `clearToken()`, and the optional `onTokenChange` callback let your application manage storage. There is no credential persistence or telemetry in the library.

The API uses query parameters for login credentials and session tokens. Avoid logging full request URLs, and redact them in monitoring and error reporting. Keep persisted tokens in storage appropriate to your application.

Requests default to the SSI client identity needed by the service: `User-Agent: Dart/3.12 (dart:io)`, `ssiapp=0815_IOS`, `version=IOS_5.0.43`, `appVersion=5.0.43`, `platform=IOS`, `context=s`, and `brand=SSI`. Without app identity metadata, an invalid-token logbook read returns HTTP 404 rather than SSI’s authentication refusal. All defaults are configurable through `metadata` and `userAgent`; `userAgent: null` lets the fetch runtime choose its header. Some runtimes override User-Agent.

## Download the dive-site catalogue

`client.initialSites(undefined, { signal })` downloads `/APP_CACHE_SITES.zip`
without a session token and returns `ApiResponse<ArrayBuffer>`. The standalone
`initialSites(client)` export is equivalent. Unzip and cache these bytes in your
application; the client does not depend on a filesystem or ZIP library.

## Update a dive

Read the current record, preserve its server identifier and unknown properties, and send the full snapshot with your changes:

```ts
const existing = dives.find((dive) => dive.odin_user_log_id === 123);
if (!existing) throw new Error('Dive not found');

const updated = { ...existing, odin_user_log_comment: 'Corrected notes' };
// Supply this dive's actual date and entry time if the response omits them.
updated.odin_user_log_date = '2026-10-24';
updated.odin_user_log_entry_time = '09:30';
delete updated.internalPk;
delete updated.needsUpload;
delete updated.localSiteId;
delete updated.localBuddyIds;

const { data: result } = await client.save_divelog({ json_data: updated });
```

Inspect the business result and re-fetch the record to confirm a write. HTTP success alone does not prove a successful update. Server merge behavior, required fields, conflict handling, and deduplication are unspecified. There are no automatic retries. The client does not calculate units or fill in missing dates, times, or identifiers.

`save_divelog` is also the interface for new records and soft deletion. A new record can use `odin_user_log_id: null`; an existing record can use `odin_user_log_deleted: true` to request deletion. The exact minimum fields for creation and the server's retention/undo behavior are unspecified.

## Types and request options

Models describe selected fields and permit additional JSON properties. Every named model field and request input field has a description in its TypeScript declaration for editor tooltips. The [field guide](./FIELD-GUIDE.md) lists all model fields with their types, meanings, units, and stated uncertainties. Optional fields do not imply that the server accepts an incomplete write. JSON-string fields have typed helpers:

```ts
import { decodeJsonField, encodeJsonField } from 'divessi-client';

const samples = decodeJsonField('DiveLog', 'odin_user_log_depthDataset', '[0,-3.5,-12]');
const text = encodeJsonField('DiveLog', 'odin_user_log_depthDataset', samples);
```

Every operation returns `{ data, status, headers }`. JSON responses also include
`rawData`, the original parsed body. All model fields are optional. By default,
response decoding is lenient: incompatible optional fields are omitted from
`data`, invalid array entries are skipped, and the remaining records are kept.
Unknown fields and null values are preserved. The unchanged original values
remain available in `rawData`, including fields omitted from the typed result.
Use that original snapshot when inspecting discrepancies or preparing a full
read-modify-write operation; request validation still applies when uploading.

Set `responseValidation: 'strict'` in `createClient` or per-call options to
reject incompatible fields with `DivessiDecodeError`. Lenient decoding still
rejects unusable top-level response shapes and malformed JSON. HTTP errors
throw `DivessiHttpError`, and invalid requests throw `DivessiInputError` in
both modes. Custom `decode` callbacks receive the original body and control
their own validation. Unmodeled business errors remain in the response body.

The default response decoder converts modeled boolean flags encoded as `0`, `1`, `"0"`, `"1"`, `"false"`, or `"true"` to booleans. Null and missing fields are preserved. Unsupported encodings are omitted in lenient mode and rejected in strict mode. Request fields still require actual booleans. Custom `decode` callbacks receive the original response values.

Per-call options support `signal`, `headers`, `metadata`, `token`, and `responseValidation`. Use `token: null` to omit a stored token on a request. Named functions such as `get_divelog(client)` are also exported. See [API.md](./API.md) for the complete operation list. API definitions live in `src/api` and are checked in with the implementation.

## Development and validation

`pnpm test` runs mocked runtime tests and declaration checks for ESM, CommonJS, and a portable ES2022 environment. `pnpm test:bun` runs the runtime suite in Bun when installed. Tests do not contact the service. React Native device compatibility and live server acceptance are not established by these checks.

## License

[MIT](./LICENSE). Third-party services, content, and trademarks are not licensed by this project.
