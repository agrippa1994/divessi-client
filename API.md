# API reference

The client exposes 35 account, logbook, profile, buddy, equipment, and dive-site operations. Every operation has a method on the client and a standalone named export.

## Operations

| Function                 | API-action alias          | Required input fields | Response model         |
| ------------------------ | ------------------------- | --------------------- | ---------------------- |
| `achievements`           | `get_user_badges`         | —                     | `JsonValue`            |
| `buddies`                | `get_buddies`             | —                     | `BuddiesResponse`      |
| `buddiesSearch`          | `search_buddy`            | `string`              | `JsonValue`            |
| `centers`                | `get_dc_data`             | `lat`, `lon`          | `DiveCenter[]`         |
| `certificates`           | `get_ccards`              | —                     | `CertificatesResponse` |
| `countries`              | `get_vars`                | —                     | `JsonValue`            |
| `divelogHistory`         | `get_divelog_history`     | —                     | `JsonValue`            |
| `dives`                  | `get_divelog`             | —                     | `DivelogResponse`      |
| `gear`                   | `get_gear`                | —                     | `Gear[]`               |
| `gearSets`               | `get_gearsets`            | —                     | `GearSet[]`            |
| `login`                  | `authenticate`            | `l`, `p`              | `User`                 |
| `profile`                | `get_user_data`           | —                     | `User`                 |
| `site`                   | `get_divesite`            | `dsid`                | `JsonValue`            |
| `siteDetail`             | `get_divesite_details`    | `site_id`             | `JsonValue`            |
| `sites`                  | `get_divesites_global`    | `last_sync`           | `SitesResponse`        |
| `tables`                 | `get_tables_21`           | —                     | `TablesResponse`       |
| `buddyUpload`            | `save_buddy`              | `json_data`           | `BuddyUploadResponse`  |
| `deleteGear`             | `delete_gear`             | `gear_id`             | `JsonValue`            |
| `deleteGearImage`        | `delete_gear_image`       | `gear_id`, `image_id` | `JsonValue`            |
| `diveUpload`             | `save_divelog`            | `json_data`           | `DiveUploadResponse`   |
| `emergencyContactUpload` | `save_emergency_contact`  | `json_data`           | `JsonValue`            |
| `emergencyContacts`      | `get_emergency_contacts`  | —                     | `JsonValue`            |
| `gearSetUpload`          | `save_gearset`            | `json_data`           | `JsonValue`            |
| `gearUpload`             | `save_gear`               | `json_data`           | `JsonValue`            |
| `privacySettingsUpload`  | `privacy_settings_update` | `json_data`           | `JsonValue`            |
| `profileImageUpload`     | `save_user_image`         | `json_data`           | `JsonValue`            |
| `profileUpload`          | `profile_update`          | `json_data`           | `JsonValue`            |
| `saveGearImage`          | `save_gear_image`         | `json_data`           | `JsonValue`            |
| `saveUserDivecomputer`   | `save_user_divecomputer`  | `json_data`           | `JsonValue`            |
| `siteDescriptionUpload`  | `save_divesite_descr`     | `json_data`           | `JsonValue`            |
| `siteImageUpload`        | `save_divesite_image`     | `json_data`           | `JsonValue`            |
| `siteUpload`             | `save_divesite`           | `json_data`           | `JsonValue`            |
| `uploadDivelogHistory`   | `set_divelog_history`     | `json_data`           | `JsonValue`            |
| `newEmailUpload`         | `profile_update_email`    | `json_data`           | `JsonValue`            |
| `newPasswordUpload`      | `profile_update_pwd`      | `json_data`           | `JsonValue`            |

For image writes, `save_image` dispatches to the appropriate typed operation for `gear`, `user_with_check`, or `divesite`.

## Inputs and responses

The declarations in `src/api/contracts.ts` describe operation inputs and outputs. `src/api/models.ts` defines sparse wire models: fields can be missing or null, and additional JSON properties are preserved. `JsonValue` marks responses or fields without a narrower contract.

Request validation checks parameter names and modeled value types. It does not prove which inner fields the server requires, whether a caller is authorized, or whether a business operation succeeded. Inspect the response and confirm writes by reading the affected record.

## Encoded JSON fields

`decodeJsonField(model, field, text)` validates a JSON-text field and returns its typed contents. `encodeJsonField(model, field, value)` validates and serializes it. Outer request JSON is serialized separately by the transport. An empty string is preserved in a response, but explicit decoding of it fails.

## Transport and sessions

The default base URL is `https://api.divessi.com/app`. `apiBaseUrl` can override it while retaining a path prefix. Requests use query parameters and URL-encoded form bodies as specified by the operation definitions.

Login credentials and session tokens are query parameters; redact URLs in logs. Sessions are isolated per client. Login stores a token only when the response declares successful authentication and contains a nonempty token.

Per-request options accept an abort signal, headers, metadata, a token override, and a custom validating decoder. `token: null` omits the stored token. `headers` are merged case-insensitively; the transport controls form Content-Type. Failed requests are not retried automatically.

The default User-Agent is `divessi-client/0.1.0`. Metadata defaults are empty. Live compatibility, server permissions, and complete server schemas are not guaranteed.
