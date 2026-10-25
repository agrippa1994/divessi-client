import { decodeJsonField } from 'divessi-client';
import { loginFromEnvironment, reportFailure } from './session.ts';

try {
  const client = await loginFromEnvironment();
  const { data } = await client.get_divelog();
  if (!Array.isArray(data.logbook_details)) {
    throw new Error('No logbook was returned; inspect the business response in your application');
  }

  const dives = data.logbook_details.filter((dive) => dive.odin_user_log_deleted !== true);
  console.table(
    dives.map((dive) => ({
      id: dive.odin_user_log_id,
      date: dive.odin_user_log_date,
      entryTime: dive.odin_user_log_entry_time,
      depthMeters: dive.odin_user_log_depth_m,
      durationMinutes: dive.odin_user_log_divetime,
      notes: dive.odin_user_log_comment,
    })),
  );

  // Select by the server ID rather than the local internalPk value.
  const id = process.argv[2];
  if (id !== undefined) {
    const selected = dives.find((dive) => dive.odin_user_log_id === Number(id));
    if (!selected) throw new Error('Dive not found');
    const depthText = selected.odin_user_log_depthDataset;
    if (depthText) {
      const depths = decodeJsonField('DiveLog', 'odin_user_log_depthDataset', depthText);
      console.log('Depth samples (source-dependent convention):', depths);
    }
  }
} catch (error) {
  reportFailure(error);
}
