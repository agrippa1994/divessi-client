import api = require('divessi-client');
const client = api.createClient();
async function check() {
  const result = await client.get_divelog();
  const depth: number | null | undefined = result.data.logbook_details?.[0]?.odin_user_log_depth_m;
  void depth;
  // @ts-expect-error CJS types enforce credentials too
  void client.login({});
}
void check;
