import { readFile } from 'node:fs/promises';
import type { DiveLog } from 'divessi-client';
import { loginFromEnvironment, reportFailure } from './session.ts';

const path = process.argv[2];
if (!path) {
  console.error('Usage: node examples/create-dive.ts /path/to/your-dive.json');
  process.exitCode = 1;
} else {
  try {
    // The client validates modeled field types before sending the request.
    const dive: DiveLog = JSON.parse(await readFile(path, 'utf8'));
    if (!dive || typeof dive !== 'object' || Array.isArray(dive)) {
      throw new Error('The dive file must contain a JSON object');
    }
    if (dive.odin_user_log_id != null || dive.odin_user_log_deleted === true) {
      throw new Error('Use a new dive without a server ID or deletion marker');
    }
    if (!dive.odin_user_log_date || !dive.odin_user_log_entry_time) {
      throw new Error('Supply the actual dive date and entry time');
    }
    dive.odin_user_log_id = null;
    delete dive.internalPk;
    delete dive.needsUpload;
    delete dive.localSiteId;
    delete dive.localBuddyIds;

    const client = await loginFromEnvironment();
    const { data: before } = await client.get_divelog();
    if (!Array.isArray(before.logbook_details)) throw new Error('Could not read the logbook');
    const previousIds = new Set(before.logbook_details.map((record) => record.odin_user_log_id));

    const { data: saved } = await client.save_divelog({ json_data: dive });
    // The service has no documented universal success marker. Show business fields,
    // then read back candidates without claiming that HTTP success confirms creation.
    console.log('Save response:', {
      result: saved.result,
      success: saved.success,
      ok: saved.ok,
      id: saved.odin_user_log_id,
    });
    const { data: after } = await client.get_divelog();
    const candidates = (after.logbook_details ?? []).filter(
      (record) =>
        record.odin_user_log_id != null &&
        !previousIds.has(record.odin_user_log_id) &&
        record.odin_user_log_date === dive.odin_user_log_date &&
        record.odin_user_log_entry_time === dive.odin_user_log_entry_time &&
        record.odin_user_log_deleted !== true,
    );
    console.table(candidates);
    console.log(
      'Inspect the save result and read-back candidates before treating the dive as created.',
    );
    if (candidates.length !== 1) {
      console.error(
        'Creation could not be confirmed uniquely. Check your logbook before retrying.',
      );
      process.exitCode = 1;
    }
  } catch (error) {
    reportFailure(error);
  }
}
