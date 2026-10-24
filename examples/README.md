# Dive examples

These examples run on Node.js 24 using its built-in TypeScript support. From the repository, install dependencies and build first:

```sh
pnpm install --frozen-lockfile
pnpm build
```

Set `DIVESSI_TOKEN` to an existing session token, or set both `DIVESSI_LOGIN` and `DIVESSI_PASSWORD` through your shell or secret manager. Credentials stay in memory. Do not commit them or put them in command arguments. Node does not load `.env` files automatically; you can use `node --env-file=/path/to/private.env ...` if needed.

Read active dives, optionally selecting a server dive ID to decode depth samples:

```sh
node examples/read-dives.ts
node examples/read-dives.ts 123
```

To create a dive, copy [dive.json](./dive.json) outside the repository and replace the sample values with your actual date, entry time, depth in meters, duration in minutes, and notes. Add real site/buddy identifiers only if you have them. Then run:

```sh
node examples/create-dive.ts /path/to/your-dive.json
```

This sends a real write. It reads the logbook before and after the save, prints the business result, and lists new records matching the date and entry time. A candidate is evidence to inspect, not a guaranteed acknowledgement: concurrent writes and delayed visibility can make this ambiguous. Check the logbook before retrying to avoid duplicate dives. The service's minimum creation fields and success conventions are unspecified; these examples have not been verified against the live service.

The examples are also included in the npm archive. Copy the `.ts` files into your application alongside an installed `divessi-client`. They use the public package exports and require no example-specific runtime dependencies. `pnpm test:types` checks them without contacting the service.
