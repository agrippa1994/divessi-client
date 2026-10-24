import { createClient, type DivessiClient } from 'divessi-client';

export async function loginFromEnvironment(): Promise<DivessiClient> {
  const client = createClient({ metadata: { lang: 'eng' } });
  const token = process.env.DIVESSI_TOKEN;
  if (token) {
    client.setToken(token);
    return client;
  }

  const l = process.env.DIVESSI_LOGIN;
  const p = process.env.DIVESSI_PASSWORD;
  if (!l || !p) throw new Error('Set DIVESSI_TOKEN or both DIVESSI_LOGIN and DIVESSI_PASSWORD');

  const { data } = await client.login({ l, p });
  if (!data.authenticated || !data.token) throw new Error('Login was not accepted');
  return client;
}

export function reportFailure(error: unknown): void {
  // Request errors can carry URLs containing credentials or tokens. Do not print them.
  console.error(
    'Example failed (%s). No request details were logged.',
    error instanceof Error ? error.name : 'unknown error',
  );
  process.exitCode = 1;
}
