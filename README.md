# divessi-client

Unofficial TypeScript client for personal logbook, profile, buddy, equipment, and dive-site operations in the SSI / DiveSSI API.

Independent project. Not affiliated with, endorsed by, or supported by Scuba Schools International or HEAD Watersports. SSI, DiveSSI, and MySSI names identify the compatible service and belong to their respective owners.

- 35 operations, with descriptive names and API-action aliases.
- No runtime dependencies; uses standard `fetch` or a compatible implementation you supply.
- ESM and CommonJS builds with TypeScript declarations.
- Sparse response validation, JSON-field codecs, cancellation, and isolated in-memory sessions.

This is an unofficial, statically described interface. Server behavior and acceptance of these requests have not been verified against the live service. The service can change or restrict access at any time. Only access accounts and data you are authorized to use; this project's license does not grant rights to the service or its content.

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

Requests identify this library with `User-Agent: divessi-client/0.1.0`; no native-app identity values are supplied by default. `userAgent: null` lets the fetch runtime choose its own header. Some runtimes override User-Agent. Additional metadata is optional and caller-supplied; server requirements are not guaranteed.

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

Every operation returns `{ data, status, headers }`. HTTP errors throw `DivessiHttpError`; invalid inputs and incompatible modeled responses throw `DivessiInputError` and `DivessiDecodeError`. Unmodeled business errors remain in the response body. A custom `decode` callback can validate an otherwise untyped response.

Per-call options support `signal`, `headers`, `metadata`, and `token`. Use `token: null` to omit a stored token on a request. Named functions such as `get_divelog(client)` are also exported. See [API.md](./API.md) for the complete operation list. API definitions live in `src/api` and are checked in with the implementation.

## Development and validation

`pnpm test` runs mocked runtime tests and declaration checks for ESM, CommonJS, and a portable ES2022 environment. `pnpm test:bun` runs the runtime suite in Bun when installed. Tests do not contact the service. React Native device compatibility and live server acceptance are not established by these checks.

## License

[MIT](./LICENSE). Third-party services, content, and trademarks are not licensed by this project.
