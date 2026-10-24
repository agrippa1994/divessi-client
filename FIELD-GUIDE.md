# Field guide

Descriptions for all 721 named fields in 37 wire models and 29 fields in 24 request input types. The same descriptions appear in the TypeScript declarations and editor tooltips.

Models are sparse: fields can be absent or null, and additional JSON properties are preserved. Optional TypeScript fields do not establish which values the server requires for writes. Field names provide descriptive hints; unspecified codes, units, date formats, scales, and device-specific flags must not be guessed.

Depth, duration, pressure, and temperature fields with explicit unit suffixes use those units. Compact sample records can follow device-specific conventions. DiveRecord.t is elapsed time in milliseconds; PressureRecord.t is a tank index. The client does not normalize measurements between devices.

JsonString<T> is a string containing JSON for T. Use decodeJsonField and encodeJsonField for the inner value; the request transport handles the outer serialization independently.

## Models

- [BuddiesResponse](#buddiesresponse)
- [Buddy](#buddy)
- [BuddyUploadResponse](#buddyuploadresponse)
- [Certificate](#certificate)
- [CertificatesResponse](#certificatesresponse)
- [DecoStop](#decostop)
- [DiveAlarm](#divealarm)
- [DiveCenter](#divecenter)
- [DiveGasMix](#divegasmix)
- [DiveLocationSample](#divelocationsample)
- [DiveLog](#divelog)
- [DiveRecord](#diverecord)
- [DiveUploadResponse](#diveuploadresponse)
- [DivelogResponse](#divelogresponse)
- [EmergencyContact](#emergencycontact)
- [FreeDiveSessionChart](#freedivesessionchart)
- [Gear](#gear)
- [GearImage](#gearimage)
- [GearImageData](#gearimagedata)
- [GearImages](#gearimages)
- [GearSet](#gearset)
- [KnowledgeTable](#knowledgetable)
- [NewEmailData](#newemaildata)
- [NewPasswordData](#newpassworddata)
- [PressureRecord](#pressurerecord)
- [PrivacySettingsData](#privacysettingsdata)
- [ProfileImageData](#profileimagedata)
- [Site](#site)
- [SiteDescriptionData](#sitedescriptiondata)
- [SiteDetail](#sitedetail)
- [SiteDetailDescription](#sitedetaildescription)
- [SiteDetailImage](#sitedetailimage)
- [SiteImageData](#siteimagedata)
- [SitesResponse](#sitesresponse)
- [TableContent](#tablecontent)
- [TablesResponse](#tablesresponse)
- [User](#user)

## BuddiesResponse

| Field          | Type              | Description                                |
| -------------- | ----------------- | ------------------------------------------ |
| `user_buddies` | `Buddy[] \| null` | Buddy records associated with the account. |

## Buddy

| Field           | Type                | Description                                                        |
| --------------- | ------------------- | ------------------------------------------------------------------ |
| `internalPk`    | `number \| null`    | Primary key in the app’s local database; not a server identifier.  |
| `id`            | `number \| null`    | Record identifier.                                                 |
| `localRefId`    | `number \| null`    | Local reference used before a server identifier is available.      |
| `address`       | `string \| null`    | Postal address.                                                    |
| `dob`           | `JsonValue \| null` | Date of birth; date encoding is unspecified.                       |
| `comment`       | `string \| null`    | Free-text comment.                                                 |
| `added`         | `JsonValue \| null` | Date the record was added; wire date encoding is unspecified.      |
| `email`         | `string \| null`    | Email address.                                                     |
| `firstname`     | `string \| null`    | Given name.                                                        |
| `gender`        | `number \| null`    | Gender code; allowed values are unspecified.                       |
| `image`         | `string \| null`    | Image reference; URL/path conventions depend on this model.        |
| `lastname`      | `string \| null`    | Family name.                                                       |
| `leader_nr`     | `number \| null`    | Buddy’s leader/instructor registration number.                     |
| `leader_active` | `boolean \| null`   | Whether the buddy’s leader/instructor status is active.            |
| `master_id`     | `number \| null`    | Master user identifier for the linked buddy.                       |
| `nickname`      | `string \| null`    | Preferred display nickname.                                        |
| `phone`         | `string \| null`    | Telephone number.                                                  |
| `deleted`       | `boolean \| null`   | Deletion marker used by synchronization.                           |
| `needsUpload`   | `boolean \| null`   | Whether the local record is queued for synchronization.            |
| `confirmed`     | `boolean \| null`   | Confirmation state; the server’s transition rules are unspecified. |
| `favorite`      | `boolean \| null`   | Whether marked as a favorite.                                      |

## BuddyUploadResponse

| Field    | Type                | Description                                               |
| -------- | ------------------- | --------------------------------------------------------- |
| `result` | `JsonValue \| null` | Raw buddy-save result; success semantics are unspecified. |
| `buddy`  | `JsonValue \| null` | Returned buddy value; its envelope/shape is unspecified.  |

## Certificate

| Field                      | Type                | Description                                                                         |
| -------------------------- | ------------------- | ----------------------------------------------------------------------------------- |
| `ccard_uid`                | `string \| null`    | Certification/insurance card identifier.                                            |
| `ccard_course_id`          | `string \| null`    | Identifier of the certified course.                                                 |
| `ccard_course_name`        | `string \| null`    | Full certified-course name.                                                         |
| `ccard_course_short`       | `string \| null`    | Short certified-course name.                                                        |
| `ccard_cat`                | `string \| null`    | Card category code.                                                                 |
| `ccard_cat_title`          | `string \| null`    | Display title of the card category.                                                 |
| `ccard_dives`              | `string \| null`    | Dive-count requirement/value attached to the card; exact semantics are unspecified. |
| `ccard_issue_date`         | `JsonValue \| null` | Card issue date; raw date encoding is unspecified.                                  |
| `ccard_expire_date`        | `JsonValue \| null` | Card expiry date; raw date encoding is unspecified.                                 |
| `ccard_instructor_number`  | `string \| null`    | Issuing instructor’s registration number.                                           |
| `ccard_instructor_name`    | `string \| null`    | Issuing instructor’s display name.                                                  |
| `ccard_divecenter_number`  | `string \| null`    | Issuing dive center’s registration number.                                          |
| `ccard_divecenter_name`    | `string \| null`    | Certification card divecenter name.                                                 |
| `ccard_divecenter_city`    | `string \| null`    | Certification card divecenter city.                                                 |
| `ccard_divecenter_country` | `string \| null`    | Certification card divecenter country.                                              |
| `ccard_image_back`         | `string \| null`    | Back-of-card image reference.                                                       |
| `ccard_image_front`        | `string \| null`    | Front-of-card image reference.                                                      |
| `ccard_image_front_thumb`  | `string \| null`    | Thumbnail of the front-of-card image.                                               |

## CertificatesResponse

| Field        | Type                    | Description                                          |
| ------------ | ----------------------- | ---------------------------------------------------- |
| `cat_array`  | `JsonValue \| null`     | Card category metadata; nested shape is unspecified. |
| `ccard_list` | `Certificate[] \| null` | Certification-card records.                          |

## DecoStop

| Field | Type                | Description                                                                                       |
| ----- | ------------------- | ------------------------------------------------------------------------------------------------- |
| `d`   | `number \| null`    | Decompression-stop depth (depth); the unit/sign convention is not established for every producer. |
| `t`   | `number \| null`    | Stop time (time); the stored time unit is unspecified.                                            |
| `ty`  | `JsonValue \| null` | Decompression-stop classification; the allowed wire codes are unspecified.                        |
| `tts` | `number \| null`    | Time-to-surface value (tts); the stored time unit is unspecified.                                 |

## DiveAlarm

| Field                  | Type                | Description                                                                                                                                           |
| ---------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `position`             | `number \| null`    | Sample/chart position associated with the alarm record.                                                                                               |
| `deco`                 | `JsonValue \| null` | Decompression alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                    |
| `violation`            | `JsonValue \| null` | Decompression-violation alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                          |
| `speed`                | `JsonValue \| null` | Speed/ascent alarm value; scale is device-dependent. The raw flag representation is source-dependent and remains JsonValue.                           |
| `fast_ascent`          | `JsonValue \| null` | Fast-ascent alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                      |
| `UNCONTROLLED_ASCENT`  | `JsonValue \| null` | Uncontrolled-ascent alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                              |
| `MOD_REACHED`          | `JsonValue \| null` | Maximum-operating-depth alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                          |
| `CNS_DANGER`           | `JsonValue \| null` | CNS oxygen-exposure danger alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                       |
| `CNS_EXTREME`          | `JsonValue \| null` | CNS oxygen-exposure extreme alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                      |
| `MISSED_DECO`          | `JsonValue \| null` | Missed-decompression alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                             |
| `LOW_BATTERY`          | `JsonValue \| null` | Low battery alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                      |
| `VERY_LOW_BATTERY`     | `JsonValue \| null` | Very low battery alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                 |
| `PROBE_LOW_BATTERY`    | `JsonValue \| null` | Probe low battery alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                |
| `LOW_TANK_PRESSURE`    | `JsonValue \| null` | Low tank pressure alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                |
| `TANK_RESERVE_REACHED` | `JsonValue \| null` | Tank reserve reached alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                             |
| `TANK_LOST_LINK`       | `JsonValue \| null` | Tank lost link alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                   |
| `MAX_DIVE_DEPTH`       | `JsonValue \| null` | Max dive depth alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                   |
| `RUN_AWAY_DECO`        | `JsonValue \| null` | Run away deco alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                    |
| `TANK_HALF_REACHED`    | `JsonValue \| null` | Tank half reached alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                |
| `NODECO_2MIN`          | `JsonValue \| null` | No-decompression-limit two-minute warning marker. The raw flag representation is source-dependent and remains JsonValue.                              |
| `NODECO_DECO`          | `JsonValue \| null` | Transition from no-decompression to decompression warning marker. The raw flag representation is source-dependent and remains JsonValue.              |
| `MULTIGAS_ATANKISLOW`  | `JsonValue \| null` | Multigas atankislow alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                              |
| `DIVETIME_HALFTIME`    | `JsonValue \| null` | Divetime halftime alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                |
| `DIVETIME_FULLTIME`    | `JsonValue \| null` | Divetime fulltime alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                |
| `GAS_SWITCHPOINT`      | `JsonValue \| null` | Gas switchpoint alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                  |
| `GAS_IGNORED`          | `JsonValue \| null` | Gas ignored alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                      |
| `GAS_CHANGED`          | `JsonValue \| null` | Gas changed alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                      |
| `GAS_NOTCHANGED`       | `JsonValue \| null` | Gas notchanged alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                   |
| `GAS_ADDED`            | `JsonValue \| null` | Gas added alarm marker. The raw flag representation is source-dependent and remains JsonValue.                                                        |
| `RGT_3MIN`             | `JsonValue \| null` | Remaining-gas-time three-minute warning marker. The raw flag representation is source-dependent and remains JsonValue.                                |
| `PSM_ERROR`            | `JsonValue \| null` | Device PSM error marker; the acronym’s device-specific meaning is unspecified. The raw flag representation is source-dependent and remains JsonValue. |
| `CEILCON_1MIN`         | `JsonValue \| null` | Device CEILCON_1MIN alarm marker; the exact device condition is unspecified. The raw flag representation is source-dependent and remains JsonValue.   |

## DiveCenter

| Field               | Type                | Description                                                                 |
| ------------------- | ------------------- | --------------------------------------------------------------------------- |
| `dc_id`             | `JsonValue \| null` | Dive-center/facility identifier.                                            |
| `type`              | `string \| null`    | App-specific type code; allowed values are unspecified.                     |
| `type_title`        | `string \| null`    | Display label for the facility type.                                        |
| `type_flags`        | `string \| null`    | Facility-type capability flags; bit meanings are unspecified.               |
| `type_pro_training` | `number \| null`    | Professional-training capability/type marker; encoding is unspecified.      |
| `name`              | `string \| null`    | Display name.                                                               |
| `distance`          | `number \| null`    | Distance from the search origin; the wire distance unit is unspecified.     |
| `city`              | `string \| null`    | City name.                                                                  |
| `country`           | `string \| null`    | Country value; code versus display-name conventions depend on the response. |
| `tel`               | `JsonValue \| null` | Telephone number.                                                           |
| `state`             | `string \| null`    | State or province.                                                          |
| `street`            | `string \| null`    | Street address.                                                             |
| `zip`               | `number \| null`    | Postal code.                                                                |
| `email`             | `string \| null`    | Email address.                                                              |
| `logo`              | `JsonValue \| null` | Facility logo image reference.                                              |
| `more`              | `JsonValue \| null` | Additional facility information; its raw structure is unspecified.          |
| `lon`               | `JsonValue \| null` | Longitude coordinate.                                                       |
| `lat`               | `JsonValue \| null` | Latitude coordinate.                                                        |
| `web`               | `JsonValue \| null` | Website URL.                                                                |
| `images`            | `string[] \| null`  | Facility image-reference list.                                              |
| `hours`             | `string \| null`    | Opening-hours information; raw wire structure is unspecified.               |

## DiveGasMix

| Field   | Type             | Description                                                                                               |
| ------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| `index` | `number \| null` | Gas-mixture index reported by the source device.                                                          |
| `o2`    | `number \| null` | Oxygen component of the breathing gas; fraction versus percentage scale is not universally established.   |
| `n2`    | `number \| null` | Nitrogen component of the breathing gas; fraction versus percentage scale is not universally established. |
| `he`    | `number \| null` | Helium component of the breathing gas; fraction versus percentage scale is not universally established.   |

## DiveLocationSample

| Field  | Type             | Description                                              |
| ------ | ---------------- | -------------------------------------------------------- |
| `lat`  | `number \| null` | Latitude of the sampled position.                        |
| `long` | `number \| null` | Longitude of the sampled position; the wire key is long. |

## DiveLog

| Field                                                 | Type                                         | Description                                                                                                                                                                                                                  |
| ----------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `internalPk`                                          | `number \| null`                             | Primary key in the app’s local database; not a server identifier.                                                                                                                                                            |
| `odin_user_log_id`                                    | `number \| null`                             | Server dive-log identifier.                                                                                                                                                                                                  |
| `odin_user_log_datetime`                              | `JsonValue \| null`                          | Combined dive date/time value; timezone and raw encoding are unspecified.                                                                                                                                                    |
| `odin_user_log_depth_m`                               | `number \| null`                             | Depth in meters.                                                                                                                                                                                                             |
| `odin_user_log_depth_ft`                              | `number \| null`                             | Depth in feet.                                                                                                                                                                                                               |
| `odin_user_log_avg_depth_m`                           | `number \| null`                             | Average depth in meters.                                                                                                                                                                                                     |
| `odin_user_log_avg_depth_ft`                          | `number \| null`                             | Average depth in feet.                                                                                                                                                                                                       |
| `odin_user_log_divetime`                              | `number \| null`                             | Logged dive duration in minutes, distinct from the millisecond timestamps in DiveRecord.t.                                                                                                                                   |
| `odin_user_log_nr`                                    | `number \| null`                             | Dive number in the user’s logbook.                                                                                                                                                                                           |
| `odin_user_log_dive_type`                             | `number \| null`                             | App dive-type code; the complete enum is unspecified.                                                                                                                                                                        |
| `odin_user_log_rating`                                | `number \| null`                             | User’s dive rating; scale is unspecified.                                                                                                                                                                                    |
| `odin_user_log_airtemp_c`                             | `number \| null`                             | Air temperature in degrees Celsius.                                                                                                                                                                                          |
| `odin_user_log_airtemp_f`                             | `number \| null`                             | Air temperature in degrees Fahrenheit.                                                                                                                                                                                       |
| `odin_user_log_watertemp_c`                           | `number \| null`                             | Water temperature in degrees Celsius.                                                                                                                                                                                        |
| `odin_user_log_watertemp_f`                           | `number \| null`                             | Water temperature in degrees Fahrenheit.                                                                                                                                                                                     |
| `odin_user_log_pressure_start_bar`                    | `number \| null`                             | Pressure start in bar.                                                                                                                                                                                                       |
| `odin_user_log_pressure_start_psi`                    | `number \| null`                             | Pressure start in psi.                                                                                                                                                                                                       |
| `odin_user_log_pressure_end_bar`                      | `number \| null`                             | Pressure end in bar.                                                                                                                                                                                                         |
| `odin_user_log_pressure_end_psi`                      | `number \| null`                             | Pressure end in psi.                                                                                                                                                                                                         |
| `odin_user_log_dive_sites_id`                         | `number \| null`                             | Server identifier of the dive site.                                                                                                                                                                                          |
| `localSiteId`                                         | `number \| null`                             | Local dive-site reference used while a server site ID is unavailable.                                                                                                                                                        |
| `odin_user_log_buddy_ids`                             | `number[] \| null`                           | Server buddy identifiers linked to this dive.                                                                                                                                                                                |
| `log_linked_facility_id`                              | `number \| null`                             | Facility identifier linked to this dive.                                                                                                                                                                                     |
| `localBuddyIds`                                       | `number[] \| null`                           | Local buddy references associated with the dive.                                                                                                                                                                             |
| `odin_user_log_animal_ids`                            | `number[] \| null`                           | Wildlife identifiers recorded for this dive.                                                                                                                                                                                 |
| `odin_user_log_gear`                                  | `number[] \| null`                           | Identifiers of equipment used on this dive.                                                                                                                                                                                  |
| `odin_user_log_user_master_id`                        | `number \| null`                             | Master user identifier that owns the dive.                                                                                                                                                                                   |
| `odin_user_log_leader_nr`                             | `string \| null`                             | Dive leader/instructor number.                                                                                                                                                                                               |
| `odin_user_log_comment`                               | `string \| null`                             | Free-text dive notes.                                                                                                                                                                                                        |
| `odin_user_log_crdate`                                | `JsonValue \| null`                          | Dive-log creation timestamp; wire encoding is unspecified.                                                                                                                                                                   |
| `odin_user_log_deleted`                               | `boolean \| null`                            | Deletion marker for the dive log.                                                                                                                                                                                            |
| `reset_profile_divelog_number_with_deletion`          | `boolean \| null`                            | Deletion option controlling whether profile dive numbering is reset; encoding and transitions are unspecified.                                                                                                               |
| `odin_user_log_var_divetype_id`                       | `number \| null`                             | Selected divetype lookup identifier. Resolve labels using service reference data; the full server value domain is unspecified.                                                                                               |
| `odin_user_log_var_water_body_id`                     | `number \| null`                             | Selected water body lookup identifier. Resolve labels using service reference data; the full server value domain is unspecified.                                                                                             |
| `odin_user_log_var_watertype_id`                      | `number \| null`                             | Selected watertype lookup identifier. Resolve labels using service reference data; the full server value domain is unspecified.                                                                                              |
| `odin_user_log_var_entry_id`                          | `number \| null`                             | Selected entry lookup identifier. Resolve labels using service reference data; the full server value domain is unspecified.                                                                                                  |
| `odin_user_log_var_current_id`                        | `number \| null`                             | Selected current lookup identifier. Resolve labels using service reference data; the full server value domain is unspecified.                                                                                                |
| `odin_user_log_var_surface_id`                        | `number \| null`                             | Selected surface lookup identifier. Resolve labels using service reference data; the full server value domain is unspecified.                                                                                                |
| `odin_user_log_var_weather_id`                        | `number \| null`                             | Selected weather lookup identifier. Resolve labels using service reference data; the full server value domain is unspecified.                                                                                                |
| `odin_user_log_var_tanktype_id`                       | `number \| null`                             | Selected tanktype lookup identifier. Resolve labels using service reference data; the full server value domain is unspecified.                                                                                               |
| `odin_user_log_vis_m`                                 | `number \| null`                             | Visibility in meters.                                                                                                                                                                                                        |
| `odin_user_log_vis_ft`                                | `number \| null`                             | Visibility in feet.                                                                                                                                                                                                          |
| `odin_user_log_weight_kg`                             | `number \| null`                             | Weight in kilograms.                                                                                                                                                                                                         |
| `odin_user_log_weight_lb`                             | `number \| null`                             | Weight in pounds.                                                                                                                                                                                                            |
| `odin_user_log_tank_vol_l`                            | `number \| null`                             | Tank volume in liters.                                                                                                                                                                                                       |
| `odin_user_log_tank_vol_cuft`                         | `number \| null`                             | Tank volume in cubic feet.                                                                                                                                                                                                   |
| `odin_user_log_ean`                                   | `boolean \| null`                            | Nitrox/enriched-air indicator; wire code meanings are unspecified.                                                                                                                                                           |
| `odin_user_log_ean_percent`                           | `number \| null`                             | Oxygen percentage for the main enriched-air gas.                                                                                                                                                                             |
| `odin_user_log_var_specialdive_id`                    | `string \| null`                             | Selected specialdive lookup identifier. Resolve labels using service reference data; the full server value domain is unspecified.                                                                                            |
| `odin_user_log_amv_l`                                 | `number \| null`                             | Amv in liters.                                                                                                                                                                                                               |
| `odin_user_log_amv_psi`                               | `number \| null`                             | Amv in psi.                                                                                                                                                                                                                  |
| `odin_user_log_frd_suit`                              | `string \| null`                             | Dive log frd suit.                                                                                                                                                                                                           |
| `odin_user_log_frd_weight_kg`                         | `number \| null`                             | Freediving weight in kilograms.                                                                                                                                                                                              |
| `odin_user_log_frd_weight_lb`                         | `number \| null`                             | Freediving weight in pounds.                                                                                                                                                                                                 |
| `odin_user_log_frd_neutral_m`                         | `number \| null`                             | Freediving neutral in meters.                                                                                                                                                                                                |
| `odin_user_log_frd_neutral_ft`                        | `number \| null`                             | Freediving neutral in feet.                                                                                                                                                                                                  |
| `odin_user_log_frd_divetype_id`                       | `number \| null`                             | Frd divetype identifier for this record.                                                                                                                                                                                     |
| `odin_user_log_frdwater_body_id`                      | `number \| null`                             | Frdwater body identifier for this record.                                                                                                                                                                                    |
| `odin_user_log_frddisc_STA`                           | `number \| null`                             | Static apnea discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                            |
| `odin_user_log_frddisc_STA_WU`                        | `number \| null`                             | Static apnea warm-up entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                                |
| `odin_user_log_frddisc_STA_MAX`                       | `number \| null`                             | Static apnea maximum/result value. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                         |
| `odin_user_log_frddisc_STA_CT`                        | `number \| null`                             | Static apnea CT entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                                     |
| `odin_user_log_frddisc_STATT`                         | `number \| null`                             | Static-apnea interval training discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                          |
| `odin_user_log_frddisc_STATT_RP`                      | `number \| null`                             | Static-apnea interval training repetition entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                           |
| `odin_user_log_frddisc_STATT_MAX`                     | `number \| null`                             | Static-apnea interval training maximum/result value. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                       |
| `odin_user_log_frddisc_WAPN`                          | `number \| null`                             | Walking apnea discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                           |
| `odin_user_log_frddisc_WAPN_WU`                       | `number \| null`                             | Walking apnea warm-up entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                               |
| `odin_user_log_frddisc_WAPN_RP`                       | `number \| null`                             | Walking apnea repetition entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                            |
| `odin_user_log_frddisc_WAPN_MAX`                      | `number \| null`                             | Walking apnea maximum/result value. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                        |
| `odin_user_log_frddisc_DYN`                           | `number \| null`                             | Dynamic apnea discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                           |
| `odin_user_log_frddisc_DYN_WU`                        | `number \| null`                             | Dynamic apnea warm-up entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                               |
| `odin_user_log_frddisc_DYN_MAX_m`                     | `number \| null`                             | Dynamic apnea maximum/result value in meters. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                              |
| `odin_user_log_frddisc_DYN_MAX_ft`                    | `number \| null`                             | Dynamic apnea maximum/result value in feet. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                |
| `odin_user_log_frddisc_DYNTT`                         | `number \| null`                             | Dynamic-apnea interval training discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                         |
| `odin_user_log_frddisc_DYNTT_RP`                      | `number \| null`                             | Dynamic-apnea interval training repetition entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                          |
| `odin_user_log_frddisc_DYNTT_MAX_m`                   | `number \| null`                             | Dynamic-apnea interval training maximum/result value in meters. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                            |
| `odin_user_log_frddisc_DYNTT_MAX_ft`                  | `number \| null`                             | Dynamic-apnea interval training maximum/result value in feet. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                              |
| `odin_user_log_frddisc_FIM`                           | `number \| null`                             | Free immersion discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                          |
| `odin_user_log_frddisc_FIM_WU`                        | `number \| null`                             | Free immersion warm-up entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                              |
| `odin_user_log_frddisc_FIM_MAX_m`                     | `number \| null`                             | Free immersion maximum/result value in meters. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                             |
| `odin_user_log_frddisc_FIM_MAX_ft`                    | `number \| null`                             | Free immersion maximum/result value in feet. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                               |
| `odin_user_log_frddisc_FIM_TIME`                      | `string \| null`                             | Free immersion time entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                                 |
| `odin_user_log_frddisc_CWT`                           | `number \| null`                             | Constant weight discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                         |
| `odin_user_log_frddisc_CWT_WU`                        | `number \| null`                             | Constant weight warm-up entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                             |
| `odin_user_log_frddisc_CWT_MAX_m`                     | `number \| null`                             | Constant weight maximum/result value in meters. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                            |
| `odin_user_log_frddisc_CWT_MAX_ft`                    | `number \| null`                             | Constant weight maximum/result value in feet. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                              |
| `odin_user_log_frddisc_CWT_TIME`                      | `string \| null`                             | Constant weight time entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                                |
| `odin_user_log_frddisc_CNF`                           | `number \| null`                             | Constant weight without fins discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                            |
| `odin_user_log_frddisc_CNF_WU`                        | `number \| null`                             | Constant weight without fins warm-up entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                |
| `odin_user_log_frddisc_CNF_MAX_m`                     | `number \| null`                             | Constant weight without fins maximum/result value in meters. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                               |
| `odin_user_log_frddisc_CNF_MAX_ft`                    | `number \| null`                             | Constant weight without fins maximum/result value in feet. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                 |
| `odin_user_log_frddisc_CNF_TIME`                      | `string \| null`                             | Constant weight without fins time entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                   |
| `odin_user_log_frddisc_VWT`                           | `number \| null`                             | Variable weight discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                         |
| `odin_user_log_frddisc_VWT_WU`                        | `number \| null`                             | Variable weight warm-up entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                             |
| `odin_user_log_frddisc_VWT_MAX_m`                     | `number \| null`                             | Variable weight maximum/result value in meters. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                            |
| `odin_user_log_frddisc_VWT_MAX_ft`                    | `number \| null`                             | Variable weight maximum/result value in feet. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                              |
| `odin_user_log_frddisc_VWT_TIME`                      | `string \| null`                             | Variable weight time entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                                |
| `odin_user_log_frddisc_FRC`                           | `number \| null`                             | Functional-residual-capacity discipline discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                 |
| `odin_user_log_frddisc_FRC_RP`                        | `number \| null`                             | Functional-residual-capacity discipline repetition entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                  |
| `odin_user_log_frddisc_FRC_MAX_m`                     | `number \| null`                             | Functional-residual-capacity discipline maximum/result value in meters. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                    |
| `odin_user_log_frddisc_FRC_MAX_ft`                    | `number \| null`                             | Functional-residual-capacity discipline maximum/result value in feet. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                      |
| `odin_user_log_frddisc_DNF`                           | `number \| null`                             | Dynamic apnea without fins discipline marker. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                              |
| `odin_user_log_frddisc_DNF_WU`                        | `number \| null`                             | Dynamic apnea without fins warm-up entry. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                                  |
| `odin_user_log_frddisc_DNF_MAX_m`                     | `number \| null`                             | Dynamic apnea without fins maximum/result value in meters. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                 |
| `odin_user_log_frddisc_DNF_MAX_ft`                    | `number \| null`                             | Dynamic apnea without fins maximum/result value in feet. Protocol-specific encoding, and units where absent from the key, are unspecified.                                                                                   |
| `odin_user_log_frd_NOTES`                             | `string \| null`                             | Free-text freediving notes.                                                                                                                                                                                                  |
| `odin_user_log_xr_divetype_id`                        | `number \| null`                             | Xr divetype identifier for this record.                                                                                                                                                                                      |
| `odin_user_log_divecenter_confirmed`                  | `boolean \| null`                            | Dive-center confirmation state; raw codes are unspecified.                                                                                                                                                                   |
| `odin_user_log_transferDate`                          | `string \| null`                             | Date/time of dive-data transfer; wire encoding is unspecified.                                                                                                                                                               |
| `odin_user_log_diveComputer`                          | `string \| null`                             | Legacy dive-computer descriptor; its encoding is unspecified.                                                                                                                                                                |
| `odin_user_log_diveComputerData`                      | `string \| null`                             | Legacy dive-computer data string; its encoding is unspecified.                                                                                                                                                               |
| `odin_user_log_depthDataset`                          | `JsonString<(number \| null)[]> \| null`     | JSON text containing nullable numeric depth samples. The Mares producer uses negative meters below the surface. Decode with decodeJsonField("DiveLog", "odin_user_log_depthDataset", text); the wire value remains a string. |
| `odin_user_log_alarmDataset`                          | `JsonString<DiveAlarm[]> \| null`            | JSON text containing source-dependent alarm records. Positions index the plotted samples. Decode with decodeJsonField("DiveLog", "odin_user_log_alarmDataset", text); the wire value remains a string.                       |
| `timestamp`                                           | `JsonValue \| null`                          | Record timestamp; wire date format and timezone are unspecified.                                                                                                                                                             |
| `odin_user_log_confirmed`                             | `boolean \| null`                            | Dive-confirmation state; server transitions are unspecified.                                                                                                                                                                 |
| `odin_user_log_verified`                              | `boolean \| null`                            | Dive-verification state; server transitions are unspecified.                                                                                                                                                                 |
| `odin_user_log_divecenter_confirmed_id`               | `number \| null`                             | Divecenter confirmed identifier for this record.                                                                                                                                                                             |
| `odin_user_log_divecenter_confirmed_name`             | `string \| null`                             | Dive log divecenter confirmed name.                                                                                                                                                                                          |
| `odin_user_log_divecenter_confirmed_logo`             | `string \| null`                             | Dive log divecenter confirmed logo.                                                                                                                                                                                          |
| `odin_user_log_leader_confirmed_id`                   | `number \| null`                             | Leader confirmed identifier for this record.                                                                                                                                                                                 |
| `odin_user_log_leader_confirmed_name`                 | `string \| null`                             | Dive log leader confirmed name.                                                                                                                                                                                              |
| `odin_user_log_user_confirmed_id`                     | `string \| null`                             | User confirmed identifier for this record.                                                                                                                                                                                   |
| `odin_user_log_user_confirmed_name`                   | `string \| null`                             | Dive log user confirmed name.                                                                                                                                                                                                |
| `odin_user_log_xr_planned_bottom_time`                | `number \| null`                             | Dive log xr planned bottom time.                                                                                                                                                                                             |
| `odin_user_log_xr_total_deco_time`                    | `number \| null`                             | Dive log xr total deco time. Expressed in minutes.                                                                                                                                                                           |
| `odin_user_log_xr_back_tanktype_id`                   | `number \| null`                             | Xr back tanktype identifier for this record.                                                                                                                                                                                 |
| `odin_user_log_xr_deco_tanktype_id`                   | `number \| null`                             | Xr deco tanktype identifier for this record.                                                                                                                                                                                 |
| `odin_user_log_xr_back_vol_l`                         | `number \| null`                             | Extended-range back volume in liters.                                                                                                                                                                                        |
| `odin_user_log_xr_deco1_vol_l`                        | `number \| null`                             | Extended-range deco1 volume in liters.                                                                                                                                                                                       |
| `odin_user_log_xr_deco2_vol_l`                        | `number \| null`                             | Extended-range deco2 volume in liters.                                                                                                                                                                                       |
| `odin_user_log_xr_deco3_vol_l`                        | `number \| null`                             | Extended-range deco3 volume in liters.                                                                                                                                                                                       |
| `odin_user_log_xr_back_ean`                           | `number \| null`                             | Extended-range back ean. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                                |
| `odin_user_log_xr_back_tmx`                           | `number \| null`                             | Extended-range back tmx. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                                |
| `odin_user_log_xr_deco1_ean`                          | `number \| null`                             | Extended-range deco1 ean. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                               |
| `odin_user_log_xr_deco1_tmx`                          | `number \| null`                             | Extended-range deco1 tmx. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                               |
| `odin_user_log_xr_deco2_ean`                          | `number \| null`                             | Extended-range deco2 ean. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                               |
| `odin_user_log_xr_deco2_tmx`                          | `number \| null`                             | Extended-range deco2 tmx. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                               |
| `odin_user_log_xr_deco3_ean_o2`                       | `number \| null`                             | Extended-range deco3 ean oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                        |
| `odin_user_log_xr_back_start_bar`                     | `number \| null`                             | Extended-range back start in bar.                                                                                                                                                                                            |
| `odin_user_log_xr_back_end_bar`                       | `number \| null`                             | Extended-range back end in bar.                                                                                                                                                                                              |
| `odin_user_log_xr_deco1_start_bar`                    | `number \| null`                             | Extended-range deco1 start in bar.                                                                                                                                                                                           |
| `odin_user_log_xr_deco1_end_bar`                      | `number \| null`                             | Extended-range deco1 end in bar.                                                                                                                                                                                             |
| `odin_user_log_xr_deco2_start_bar`                    | `number \| null`                             | Extended-range deco2 start in bar.                                                                                                                                                                                           |
| `odin_user_log_xr_deco2_end_bar`                      | `number \| null`                             | Extended-range deco2 end in bar.                                                                                                                                                                                             |
| `odin_user_log_xr_deco3_start_bar`                    | `number \| null`                             | Extended-range deco3 start in bar.                                                                                                                                                                                           |
| `odin_user_log_xr_deco3_end_bar`                      | `number \| null`                             | Extended-range deco3 end in bar.                                                                                                                                                                                             |
| `odin_user_log_xr_sac_bottom_l`                       | `number \| null`                             | Extended-range sac bottom in liters.                                                                                                                                                                                         |
| `odin_user_log_xr_sac_deco_l`                         | `number \| null`                             | Extended-range sac deco in liters.                                                                                                                                                                                           |
| `odin_user_log_frddisc`                               | `string \| null`                             | Freediving discipline code; the server enum domain is not constrained.                                                                                                                                                       |
| `odin_user_log_gear_details`                          | `string \| null`                             | Legacy equipment-detail value; its structure is unspecified.                                                                                                                                                                 |
| `odin_user_log_xr_back`                               | `number \| null`                             | Dive log xr back.                                                                                                                                                                                                            |
| `odin_user_log_xr_deco1`                              | `number \| null`                             | Dive log xr deco1.                                                                                                                                                                                                           |
| `odin_user_log_xr_deco2`                              | `number \| null`                             | Dive log xr deco2.                                                                                                                                                                                                           |
| `odin_user_log_xr_deco3`                              | `number \| null`                             | Dive log xr deco3.                                                                                                                                                                                                           |
| `odin_user_log_xr_deco1_tanktype_id`                  | `number \| null`                             | Xr deco1 tanktype identifier for this record.                                                                                                                                                                                |
| `odin_user_log_xr_deco2_tanktype_id`                  | `number \| null`                             | Xr deco2 tanktype identifier for this record.                                                                                                                                                                                |
| `odin_user_log_xr_deco3_tanktype_id`                  | `number \| null`                             | Xr deco3 tanktype identifier for this record.                                                                                                                                                                                |
| `odin_user_log_xr_planned_depth`                      | `number \| null`                             | Dive log xr planned depth.                                                                                                                                                                                                   |
| `odin_user_log_xr_planned_deco_time`                  | `number \| null`                             | Dive log xr planned deco time.                                                                                                                                                                                               |
| `odin_user_log_xr_back_o2`                            | `number \| null`                             | Extended-range back oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                             |
| `odin_user_log_xr_back_he`                            | `number \| null`                             | Extended-range back helium. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                             |
| `odin_user_log_xr_deco1_o2`                           | `number \| null`                             | Extended-range deco1 oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                            |
| `odin_user_log_xr_deco1_he`                           | `number \| null`                             | Extended-range deco1 helium. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                            |
| `odin_user_log_xr_deco2_o2`                           | `number \| null`                             | Extended-range deco2 oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                            |
| `odin_user_log_xr_deco2_he`                           | `number \| null`                             | Extended-range deco2 helium. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                            |
| `odin_user_log_xr_deco3_o2`                           | `number \| null`                             | Extended-range deco3 oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                            |
| `odin_user_log_scr_unit_id`                           | `number \| null`                             | Scr unit identifier for this record.                                                                                                                                                                                         |
| `odin_user_log_scr_total_deco_time`                   | `number \| null`                             | Dive log scr total deco time. Expressed in minutes.                                                                                                                                                                          |
| `odin_user_log_scr_sac_bailout_l`                     | `number \| null`                             | Semi-closed rebreather sac bailout in liters.                                                                                                                                                                                |
| `odin_user_log_scr_sac_deco_l`                        | `number \| null`                             | Semi-closed rebreather sac deco in liters.                                                                                                                                                                                   |
| `odin_user_log_scr_bottom_tanktype_id`                | `number \| null`                             | Scr bottom tanktype identifier for this record.                                                                                                                                                                              |
| `odin_user_log_scr_bottom_tank_vol_l`                 | `number \| null`                             | Semi-closed rebreather bottom tank volume in liters.                                                                                                                                                                         |
| `odin_user_log_scr_bottom_o2`                         | `number \| null`                             | Semi-closed rebreather bottom oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                   |
| `odin_user_log_scr_bottom_setpoint`                   | `number \| null`                             | Semi-closed rebreather bottom setpoint. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                 |
| `odin_user_log_scr_bottom_start_bar`                  | `number \| null`                             | Semi-closed rebreather bottom start in bar.                                                                                                                                                                                  |
| `odin_user_log_scr_bottom_end_bar`                    | `number \| null`                             | Semi-closed rebreather bottom end in bar.                                                                                                                                                                                    |
| `odin_user_log_scr_deco`                              | `number \| null`                             | Dive log scr deco.                                                                                                                                                                                                           |
| `odin_user_log_scr_deco_tanktype_id`                  | `number \| null`                             | Scr deco tanktype identifier for this record.                                                                                                                                                                                |
| `odin_user_log_scr_deco_tank_vol_l`                   | `number \| null`                             | Semi-closed rebreather deco tank volume in liters.                                                                                                                                                                           |
| `odin_user_log_scr_deco_o2`                           | `number \| null`                             | Semi-closed rebreather deco oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                     |
| `odin_user_log_scr_deco_setpoint`                     | `number \| null`                             | Semi-closed rebreather deco setpoint. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                   |
| `odin_user_log_scr_deco_start_bar`                    | `number \| null`                             | Semi-closed rebreather deco start in bar.                                                                                                                                                                                    |
| `odin_user_log_scr_deco_end_bar`                      | `number \| null`                             | Semi-closed rebreather deco end in bar.                                                                                                                                                                                      |
| `odin_user_log_si_before`                             | `number \| null`                             | Surface interval before the dive; the stored time unit is unspecified.                                                                                                                                                       |
| `odin_user_log_watertemp_max_c`                       | `number \| null`                             | Water temperature maximum in degrees Celsius.                                                                                                                                                                                |
| `odin_user_log_watertemp_max_f`                       | `number \| null`                             | Water temperature maximum in degrees Fahrenheit.                                                                                                                                                                             |
| `odin_user_log_gf_set`                                | `string \| null`                             | Configured gradient-factor setting; combined representation is unspecified.                                                                                                                                                  |
| `odin_user_log_gf_set_1`                              | `number \| null`                             | First configured gradient-factor value; scaling is unspecified.                                                                                                                                                              |
| `odin_user_log_gf_set_2`                              | `number \| null`                             | Second configured gradient-factor value; scaling is unspecified.                                                                                                                                                             |
| `odin_user_log_gf_end`                                | `number \| null`                             | End-of-dive gradient-factor value; scaling is unspecified.                                                                                                                                                                   |
| `odin_user_log_cns_start`                             | `number \| null`                             | CNS oxygen exposure at dive start; scaling is unspecified.                                                                                                                                                                   |
| `odin_user_log_cns_end`                               | `number \| null`                             | CNS oxygen exposure at dive end; scaling is unspecified.                                                                                                                                                                     |
| `odin_user_log_otu_start`                             | `number \| null`                             | Oxygen-tolerance-unit value at dive start.                                                                                                                                                                                   |
| `odin_user_log_otu_end`                               | `number \| null`                             | Oxygen-tolerance-unit value at dive end.                                                                                                                                                                                     |
| `odin_user_log_tempDataset`                           | `JsonString<(number \| null)[]> \| null`     | JSON text containing nullable numeric temperature samples; the Mares source uses degrees Celsius. Decode with decodeJsonField("DiveLog", "odin_user_log_tempDataset", text); the wire value remains a string.                |
| `odin_user_log_gfnowDataset`                          | `JsonString<(number \| null)[]> \| null`     | JSON text containing nullable current-gradient-factor samples. Decode with decodeJsonField("DiveLog", "odin_user_log_gfnowDataset", text); the wire value remains a string.                                                  |
| `odin_user_log_gfSurfDataset`                         | `JsonString<(number \| null)[]> \| null`     | JSON text containing nullable predicted surface-gradient-factor samples. Decode with decodeJsonField("DiveLog", "odin_user_log_gfSurfDataset", text); the wire value remains a string.                                       |
| `odin_user_log_deepestDecoDataset`                    | `JsonString<(number \| null)[]> \| null`     | JSON text containing nullable deepest-decompression-stop samples; scale is unspecified. Decode with decodeJsonField("DiveLog", "odin_user_log_deepestDecoDataset", text); the wire value remains a string.                   |
| `odin_user_log_tankPressureDataset`                   | `JsonString<(number \| null)[]> \| null`     | JSON text containing nullable tank-pressure samples; the scale is source-dependent. Decode with decodeJsonField("DiveLog", "odin_user_log_tankPressureDataset", text); the wire value remains a string.                      |
| `odin_user_log_freeDiveSessionCharts`                 | `JsonString<FreeDiveSessionChart[]> \| null` | JSON text containing individual freedive summaries, each with nested depth_set/temp_set JSON strings. Decode with decodeJsonField("DiveLog", "odin_user_log_freeDiveSessionCharts", text); the wire value remains a string.  |
| `odin_user_log_divecomputer_dive_ref`                 | `string \| null`                             | Device-specific reference to the imported dive; raw representation is unspecified.                                                                                                                                           |
| `odin_user_log_divecomputer_ref`                      | `string \| null`                             | Reference to the source dive computer; raw representation is unspecified.                                                                                                                                                    |
| `odin_user_log_divecomputer_imported`                 | `boolean \| null`                            | Whether this dive was imported from a dive computer.                                                                                                                                                                         |
| `needsUpload`                                         | `boolean \| null`                            | Whether the local record is queued for synchronization.                                                                                                                                                                      |
| `odin_user_log_ccr_unit_id`                           | `number \| null`                             | Ccr unit identifier for this record.                                                                                                                                                                                         |
| `odin_user_log_ccr_total_deco_time`                   | `number \| null`                             | Dive log ccr total deco time. Expressed in minutes.                                                                                                                                                                          |
| `odin_user_log_ccr_sac_bailout_l`                     | `number \| null`                             | Closed-circuit rebreather sac bailout in liters.                                                                                                                                                                             |
| `odin_user_log_ccr_sac_deco_l`                        | `number \| null`                             | Closed-circuit rebreather sac deco in liters.                                                                                                                                                                                |
| `odin_user_log_ccr_bailout01`                         | `number \| null`                             | Dive log ccr bailout01.                                                                                                                                                                                                      |
| `odin_user_log_ccr_bailout01_tanktype_id`             | `number \| null`                             | Ccr bailout01 tanktype identifier for this record.                                                                                                                                                                           |
| `odin_user_log_ccr_bailout01_tank_vol_l`              | `number \| null`                             | Closed-circuit rebreather bailout01 tank volume in liters.                                                                                                                                                                   |
| `odin_user_log_ccr_bailout01_o2`                      | `number \| null`                             | Closed-circuit rebreather bailout01 oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                             |
| `odin_user_log_ccr_bailout01_he`                      | `number \| null`                             | Closed-circuit rebreather bailout01 helium. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                             |
| `odin_user_log_ccr_bailout01_start_bar`               | `number \| null`                             | Closed-circuit rebreather bailout01 start in bar.                                                                                                                                                                            |
| `odin_user_log_ccr_bailout01_end_bar`                 | `number \| null`                             | Closed-circuit rebreather bailout01 end in bar.                                                                                                                                                                              |
| `odin_user_log_ccr_bailout02`                         | `number \| null`                             | Dive log ccr bailout02.                                                                                                                                                                                                      |
| `odin_user_log_ccr_bailout02_tanktype_id`             | `number \| null`                             | Ccr bailout02 tanktype identifier for this record.                                                                                                                                                                           |
| `odin_user_log_ccr_bailout02_tank_vol_l`              | `number \| null`                             | Closed-circuit rebreather bailout02 tank volume in liters.                                                                                                                                                                   |
| `odin_user_log_ccr_bailout02_o2`                      | `number \| null`                             | Closed-circuit rebreather bailout02 oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                             |
| `odin_user_log_ccr_bailout02_he`                      | `number \| null`                             | Closed-circuit rebreather bailout02 helium. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                             |
| `odin_user_log_ccr_bailout02_start_bar`               | `number \| null`                             | Closed-circuit rebreather bailout02 start in bar.                                                                                                                                                                            |
| `odin_user_log_ccr_bailout02_end_bar`                 | `number \| null`                             | Closed-circuit rebreather bailout02 end in bar.                                                                                                                                                                              |
| `odin_user_log_ccr_bailout03`                         | `number \| null`                             | Dive log ccr bailout03.                                                                                                                                                                                                      |
| `odin_user_log_ccr_bailout03_tanktype_id`             | `number \| null`                             | Ccr bailout03 tanktype identifier for this record.                                                                                                                                                                           |
| `odin_user_log_ccr_bailout03_tank_vol_l`              | `number \| null`                             | Closed-circuit rebreather bailout03 tank volume in liters.                                                                                                                                                                   |
| `odin_user_log_ccr_bailout03_o2`                      | `number \| null`                             | Closed-circuit rebreather bailout03 oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                             |
| `odin_user_log_ccr_bailout03_he`                      | `number \| null`                             | Closed-circuit rebreather bailout03 helium. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                             |
| `odin_user_log_ccr_bailout03_start_bar`               | `number \| null`                             | Closed-circuit rebreather bailout03 start in bar.                                                                                                                                                                            |
| `odin_user_log_ccr_bailout03_end_bar`                 | `number \| null`                             | Closed-circuit rebreather bailout03 end in bar.                                                                                                                                                                              |
| `odin_user_log_ccr_diluent_gas`                       | `number \| null`                             | Dive log ccr diluent gas.                                                                                                                                                                                                    |
| `odin_user_log_ccr_diluent_tanktype_id`               | `number \| null`                             | Ccr diluent tanktype identifier for this record.                                                                                                                                                                             |
| `odin_user_log_ccr_diluent_tank_vol_l`                | `number \| null`                             | Closed-circuit rebreather diluent tank volume in liters.                                                                                                                                                                     |
| `odin_user_log_ccr_diluent_o2`                        | `number \| null`                             | Closed-circuit rebreather diluent oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                               |
| `odin_user_log_ccr_diluent_he`                        | `number \| null`                             | Closed-circuit rebreather diluent helium. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                               |
| `odin_user_log_ccr_diluent_start_bar`                 | `number \| null`                             | Closed-circuit rebreather diluent start in bar.                                                                                                                                                                              |
| `odin_user_log_ccr_diluent_end_bar`                   | `number \| null`                             | Closed-circuit rebreather diluent end in bar.                                                                                                                                                                                |
| `odin_user_log_deco_dive`                             | `number \| null`                             | Whether the device classified this as a decompression dive.                                                                                                                                                                  |
| `odin_user_log_deco_time`                             | `number \| null`                             | Recorded decompression time; the stored time unit is unspecified.                                                                                                                                                            |
| `odin_user_log_deco_gas`                              | `number \| null`                             | Dive log deco gas.                                                                                                                                                                                                           |
| `odin_user_log_deco_gas_tanktype_id`                  | `number \| null`                             | Deco gas tanktype identifier for this record.                                                                                                                                                                                |
| `odin_user_log_deco_gas_tank_vol_l`                   | `number \| null`                             | Deco gas tank volume in liters.                                                                                                                                                                                              |
| `odin_user_log_deco_gas_o2`                           | `number \| null`                             | Deco gas oxygen. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                                        |
| `odin_user_log_deco_gas_start_bar`                    | `number \| null`                             | Deco gas start in bar.                                                                                                                                                                                                       |
| `odin_user_log_deco_gas_end_bar`                      | `number \| null`                             | Deco gas end in bar.                                                                                                                                                                                                         |
| `odin_user_log_alarm_fast_ascent`                     | `boolean \| null`                            | Whether the dive contains a fast-ascent alarm.                                                                                                                                                                               |
| `odin_user_log_alarm_deco_stop`                       | `boolean \| null`                            | Whether the dive contains a decompression-stop alarm.                                                                                                                                                                        |
| `odin_user_log_alarm_deco_violation`                  | `boolean \| null`                            | Whether the dive contains a decompression-violation alarm.                                                                                                                                                                   |
| `needsVerificationUpload`                             | `boolean \| null`                            | Whether dive verification is queued for synchronization.                                                                                                                                                                     |
| `needsUnverifyUpload`                                 | `boolean \| null`                            | Whether removal of dive verification is queued for synchronization.                                                                                                                                                          |
| `odin_user_log_deco_gas_tank_vol_cuft`                | `number \| null`                             | Deco gas tank volume in cubic feet.                                                                                                                                                                                          |
| `odin_user_log_deco_gas_start_psi`                    | `number \| null`                             | Deco gas start in psi.                                                                                                                                                                                                       |
| `odin_user_log_deco_gas_end_psi`                      | `number \| null`                             | Deco gas end in psi.                                                                                                                                                                                                         |
| `odin_user_log_xr_back_vol_cuft`                      | `number \| null`                             | Extended-range back volume in cubic feet.                                                                                                                                                                                    |
| `odin_user_log_xr_back_start_psi`                     | `number \| null`                             | Extended-range back start in psi.                                                                                                                                                                                            |
| `odin_user_log_xr_back_end_psi`                       | `number \| null`                             | Extended-range back end in psi.                                                                                                                                                                                              |
| `odin_user_log_xr_deco1_vol_cuft`                     | `number \| null`                             | Extended-range deco1 volume in cubic feet.                                                                                                                                                                                   |
| `odin_user_log_xr_deco1_start_psi`                    | `number \| null`                             | Extended-range deco1 start in psi.                                                                                                                                                                                           |
| `odin_user_log_xr_deco1_end_psi`                      | `number \| null`                             | Extended-range deco1 end in psi.                                                                                                                                                                                             |
| `odin_user_log_xr_deco2_vol_cuft`                     | `number \| null`                             | Extended-range deco2 volume in cubic feet.                                                                                                                                                                                   |
| `odin_user_log_xr_deco2_start_psi`                    | `number \| null`                             | Extended-range deco2 start in psi.                                                                                                                                                                                           |
| `odin_user_log_xr_deco2_end_psi`                      | `number \| null`                             | Extended-range deco2 end in psi.                                                                                                                                                                                             |
| `odin_user_log_xr_deco3_vol_cuft`                     | `number \| null`                             | Extended-range deco3 volume in cubic feet.                                                                                                                                                                                   |
| `odin_user_log_xr_deco3_start_psi`                    | `number \| null`                             | Extended-range deco3 start in psi.                                                                                                                                                                                           |
| `odin_user_log_xr_deco3_end_psi`                      | `number \| null`                             | Extended-range deco3 end in psi.                                                                                                                                                                                             |
| `odin_user_log_xr_sac_bottom_psi`                     | `number \| null`                             | Extended-range sac bottom in psi.                                                                                                                                                                                            |
| `odin_user_log_xr_sac_deco_psi`                       | `number \| null`                             | Extended-range sac deco in psi.                                                                                                                                                                                              |
| `odin_user_log_xr_deco3_he`                           | `number \| null`                             | Extended-range deco3 helium. Its unit/percentage scale is unspecified unless supplied separately.                                                                                                                            |
| `odin_user_log_scr_sac_bailout_psi`                   | `number \| null`                             | Semi-closed rebreather sac bailout in psi.                                                                                                                                                                                   |
| `odin_user_log_scr_sac_deco_psi`                      | `number \| null`                             | Semi-closed rebreather sac deco in psi.                                                                                                                                                                                      |
| `odin_user_log_scr_bottom_tank_vol_cuft`              | `number \| null`                             | Semi-closed rebreather bottom tank volume in cubic feet.                                                                                                                                                                     |
| `odin_user_log_scr_bottom_start_psi`                  | `number \| null`                             | Semi-closed rebreather bottom start in psi.                                                                                                                                                                                  |
| `odin_user_log_scr_bottom_end_psi`                    | `number \| null`                             | Semi-closed rebreather bottom end in psi.                                                                                                                                                                                    |
| `odin_user_log_scr_deco_tank_vol_cuft`                | `number \| null`                             | Semi-closed rebreather deco tank volume in cubic feet.                                                                                                                                                                       |
| `odin_user_log_scr_deco_start_psi`                    | `number \| null`                             | Semi-closed rebreather deco start in psi.                                                                                                                                                                                    |
| `odin_user_log_scr_deco_end_psi`                      | `number \| null`                             | Semi-closed rebreather deco end in psi.                                                                                                                                                                                      |
| `odin_user_log_ccr_sac_bailout_psi`                   | `number \| null`                             | Closed-circuit rebreather sac bailout in psi.                                                                                                                                                                                |
| `odin_user_log_ccr_sac_deco_psi`                      | `number \| null`                             | Closed-circuit rebreather sac deco in psi.                                                                                                                                                                                   |
| `odin_user_log_ccr_bottom_tank_vol_cuft`              | `number \| null`                             | Closed-circuit rebreather bottom tank volume in cubic feet.                                                                                                                                                                  |
| `odin_user_log_ccr_o2_start_psi`                      | `number \| null`                             | Closed-circuit rebreather oxygen start in psi.                                                                                                                                                                               |
| `odin_user_log_ccr_o2_end_psi`                        | `number \| null`                             | Closed-circuit rebreather oxygen end in psi.                                                                                                                                                                                 |
| `odin_user_log_ccr_diluent_tank_vol_cuft`             | `number \| null`                             | Closed-circuit rebreather diluent tank volume in cubic feet.                                                                                                                                                                 |
| `odin_user_log_ccr_diluent_start_psi`                 | `number \| null`                             | Closed-circuit rebreather diluent start in psi.                                                                                                                                                                              |
| `odin_user_log_ccr_diluent_end_psi`                   | `number \| null`                             | Closed-circuit rebreather diluent end in psi.                                                                                                                                                                                |
| `odin_user_log_ccr_bailout01_tank_vol_cuft`           | `number \| null`                             | Closed-circuit rebreather bailout01 tank volume in cubic feet.                                                                                                                                                               |
| `odin_user_log_ccr_bailout01_start_psi`               | `number \| null`                             | Closed-circuit rebreather bailout01 start in psi.                                                                                                                                                                            |
| `odin_user_log_ccr_bailout01_end_psi`                 | `number \| null`                             | Closed-circuit rebreather bailout01 end in psi.                                                                                                                                                                              |
| `odin_user_log_ccr_bailout02_tank_vol_cuft`           | `number \| null`                             | Closed-circuit rebreather bailout02 tank volume in cubic feet.                                                                                                                                                               |
| `odin_user_log_ccr_bailout02_start_psi`               | `number \| null`                             | Closed-circuit rebreather bailout02 start in psi.                                                                                                                                                                            |
| `odin_user_log_ccr_bailout02_end_psi`                 | `number \| null`                             | Closed-circuit rebreather bailout02 end in psi.                                                                                                                                                                              |
| `odin_user_log_ccr_bailout03_tank_vol_cuft`           | `number \| null`                             | Closed-circuit rebreather bailout03 tank volume in cubic feet.                                                                                                                                                               |
| `odin_user_log_ccr_bailout03_start_psi`               | `number \| null`                             | Closed-circuit rebreather bailout03 start in psi.                                                                                                                                                                            |
| `odin_user_log_ccr_bailout03_end_psi`                 | `number \| null`                             | Closed-circuit rebreather bailout03 end in psi.                                                                                                                                                                              |
| `odin_user_log_ccr_o2_tanktype_id`                    | `number \| null`                             | Ccr o2 tanktype identifier for this record.                                                                                                                                                                                  |
| `odin_user_log_ccr_o2_tank_vol_l`                     | `number \| null`                             | Closed-circuit rebreather oxygen tank volume in liters.                                                                                                                                                                      |
| `odin_user_log_ccr_o2_tank_vol_cuft`                  | `number \| null`                             | Closed-circuit rebreather oxygen tank volume in cubic feet.                                                                                                                                                                  |
| `odin_user_log_ccr_o2_start_bar`                      | `number \| null`                             | Closed-circuit rebreather oxygen start in bar.                                                                                                                                                                               |
| `odin_user_log_ccr_o2_end_bar`                        | `number \| null`                             | Closed-circuit rebreather oxygen end in bar.                                                                                                                                                                                 |
| `log_linked_brevet_rule_id`                           | `number \| null`                             | Certification/training-rule identifier linked to this dive.                                                                                                                                                                  |
| `uploadError`                                         | `string \| null`                             | Local upload failure information; the server does not necessarily accept this field.                                                                                                                                         |
| `odin_user_log_gearconfiguration_id`                  | `number \| null`                             | Equipment-configuration identifier.                                                                                                                                                                                          |
| `log_extended_data_cleanup_weight_kg`                 | `number \| null`                             | Weight of material collected during a cleanup dive, in kilograms.                                                                                                                                                            |
| `log_extended_data_cleanup_weight_lb`                 | `number \| null`                             | Weight of material collected during a cleanup dive, in pounds.                                                                                                                                                               |
| `odin_user_log_divecomputer_serial_nr`                | `string \| null`                             | Serial number of the source dive computer.                                                                                                                                                                                   |
| `odin_user_log_divecomputer_ble_id`                   | `string \| null`                             | Bluetooth identifier of the source dive computer.                                                                                                                                                                            |
| `odin_user_log_divecomputer_id`                       | `number \| null`                             | App identifier for the source dive-computer model/device.                                                                                                                                                                    |
| `odin_user_log_divecomputer_name`                     | `string \| null`                             | Display name of the source dive computer.                                                                                                                                                                                    |
| `odin_user_log_divecomputer_manufacturer`             | `string \| null`                             | Manufacturer of the source dive computer.                                                                                                                                                                                    |
| `odin_user_log_divecomputer_firmware`                 | `string \| null`                             | Firmware-version string reported by the dive computer.                                                                                                                                                                       |
| `odin_user_log_divecomputer_raw_data_header`          | `string \| null`                             | Raw device header data retained by the app; binary/text encoding is unspecified.                                                                                                                                             |
| `odin_user_log_divecomputer_raw_data_details`         | `string \| null`                             | Raw device detail data retained by the app; binary/text encoding is unspecified.                                                                                                                                             |
| `odin_user_log_scr_start_time`                        | `number \| null`                             | Semi-closed-circuit start time; epoch/unit is unspecified.                                                                                                                                                                   |
| `odin_user_log_scr_end_time`                          | `number \| null`                             | Semi-closed-circuit end time; epoch/unit is unspecified.                                                                                                                                                                     |
| `odin_user_log_scr_oc`                                | `boolean \| null`                            | Semi-closed-circuit/open-circuit mode indicator; wire codes are unspecified.                                                                                                                                                 |
| `odin_user_log_diveSamples`                           | `JsonString<DiveRecord[]> \| null`           | JSON text containing compact DiveRecord samples, including source-specific flags and alarm masks. Decode with decodeJsonField("DiveLog", "odin_user_log_diveSamples", text); the wire value remains a string.                |
| `odin_user_log_housing_local_dive_media`              | `JsonString<JsonValue[]> \| null`            | JSON text containing local media entries; individual entries can be objects or nested JSON strings. Decode with decodeJsonField("DiveLog", "odin_user_log_housing_local_dive_media", text); the wire value remains a string. |
| `odin_user_log_apple_watch`                           | `boolean \| null`                            | Apple Watch source marker; wire encoding is unspecified.                                                                                                                                                                     |
| `odin_user_log_apple_watch_log_id`                    | `number \| null`                             | Apple Watch log identifier.                                                                                                                                                                                                  |
| `odin_user_log_apple_watch_id`                        | `number \| null`                             | Identifier of the Apple Watch that recorded the dive.                                                                                                                                                                        |
| `odin_user_log_pressureDataset`                       | `string \| null`                             | Legacy pressure dataset string. JSON encoding and its decoded structure are not established.                                                                                                                                 |
| `odin_user_log_heartRateMin`                          | `number \| null`                             | Minimum recorded heart rate; scale/sentinels are not constrained.                                                                                                                                                            |
| `odin_user_log_heartRateMax`                          | `number \| null`                             | Maximum recorded heart rate; scale/sentinels are not constrained.                                                                                                                                                            |
| `odin_user_log_heartRateAvg`                          | `number \| null`                             | Average recorded heart rate; scale/sentinels are not constrained.                                                                                                                                                            |
| `odin_user_log_heartRateDataset`                      | `JsonString<(number \| null)[]> \| null`     | JSON text containing nullable heart-rate samples; scale/sentinels are not constrained. Decode with decodeJsonField("DiveLog", "odin_user_log_heartRateDataset", text); the wire value remains a string.                      |
| `odin_user_log_batteryLevelDataset`                   | `string \| null`                             | Battery-level dataset string. JSON encoding and its decoded structure are not established.                                                                                                                                   |
| `odin_user_log_batteryLevelStart`                     | `number \| null`                             | Battery level at dive start; range/scaling is unspecified.                                                                                                                                                                   |
| `odin_user_log_batteryLevelEnd`                       | `number \| null`                             | Battery level at dive end; range/scaling is unspecified.                                                                                                                                                                     |
| `odin_user_log_accelerationDataset`                   | `string \| null`                             | Acceleration dataset string. JSON encoding, axes and units are not established.                                                                                                                                              |
| `odin_user_log_gyroDataset`                           | `string \| null`                             | Gyroscope dataset string. JSON encoding, axes and units are not established.                                                                                                                                                 |
| `odin_user_log_pos_start_latitude`                    | `number \| null`                             | Latitude at dive start.                                                                                                                                                                                                      |
| `odin_user_log_pos_start_longitude`                   | `number \| null`                             | Longitude at dive start.                                                                                                                                                                                                     |
| `odin_user_log_pos_end_latitude`                      | `number \| null`                             | Latitude at dive end.                                                                                                                                                                                                        |
| `odin_user_log_pos_end_longitude`                     | `number \| null`                             | Longitude at dive end.                                                                                                                                                                                                       |
| `odin_user_log_dive_on_own_risk`                      | `boolean \| null`                            | Own-risk acknowledgment value; wire encoding is unspecified.                                                                                                                                                                 |
| `odin_user_log_dive_on_own_risk_os_app`               | `string \| null`                             | App/OS metadata associated with the own-risk acknowledgment.                                                                                                                                                                 |
| `odin_user_log_locationDataset`                       | `JsonString<DiveLocationSample[]> \| null`   | JSON text containing latitude/longitude sample objects. Decode with decodeJsonField("DiveLog", "odin_user_log_locationDataset", text); the wire value remains a string.                                                      |
| `odin_user_log_apple_watch_app_version`               | `string \| null`                             | Version of the Apple Watch app that recorded the dive.                                                                                                                                                                       |
| `odin_user_log_apple_watch_os_version`                | `string \| null`                             | Watch operating-system version for the recorded dive.                                                                                                                                                                        |
| `log_divecomputer_max_sensor_depth`                   | `number \| null`                             | Maximum supported sensor depth reported for the source computer; unit is unspecified.                                                                                                                                        |
| `log_divecomputer_bottomtimer`                        | `boolean \| null`                            | Bottom-timer mode marker for the source computer.                                                                                                                                                                            |
| `odin_user_log_divecomputer_productname`              | `string \| null`                             | Dive log divecomputer productname.                                                                                                                                                                                           |
| `log_extended_data_latitude`                          | `number \| null`                             | Additional recorded latitude.                                                                                                                                                                                                |
| `log_extended_data_longitude`                         | `number \| null`                             | Additional recorded longitude.                                                                                                                                                                                               |
| `log_extended_data_conservatism`                      | `number \| null`                             | Decompression algorithm conservatism setting; its encoding is source-dependent.                                                                                                                                              |
| `log_extended_data_decomodel`                         | `string \| null`                             | Source decompression-model identifier; allowed values are unspecified.                                                                                                                                                       |
| `log_extended_data_libdivecomputer_identifier_base64` | `string \| null`                             | Base64-encoded libdivecomputer dive identifier.                                                                                                                                                                              |
| `odin_user_log_date`                                  | `string \| null`                             | Dive date string produced by the upload code; no universal timezone is imposed.                                                                                                                                              |
| `odin_user_log_entry_time`                            | `string \| null`                             | Dive entry-time string produced by the upload code; no universal timezone is imposed.                                                                                                                                        |

## DiveRecord

| Field  | Type                     | Description                                                                                                                                               |
| ------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `n`    | `number \| null`         | Sample sequence number. Mares-origin records start at 1; other devices may differ.                                                                        |
| `t`    | `number \| null`         | Elapsed dive time in milliseconds; this is not a Unix timestamp.                                                                                          |
| `d`    | `number \| null`         | Depth sample. Mares-origin data uses negative meters below the surface; other devices may use different conventions.                                      |
| `p`    | `number \| null`         | Pressure sample (pressure). This is separate from the tankPressureRecord in pr; its unit and sensor interpretation are unspecified.                       |
| `te`   | `number \| null`         | Temperature sample. Mares-origin data uses degrees Celsius; other devices may use different conventions.                                                  |
| `s`    | `number \| null`         | Speed sample (speed). The source-specific sign and unit are unspecified.                                                                                  |
| `pr`   | `PressureRecord \| null` | Tank-pressure measurement (tankPressureRecord). Its t is a tank index, not a timestamp.                                                                   |
| `a`    | `number \| null`         | Alarm bitmask associated with the originating device. Its layout is distinct from lda and the watch/housing masks; preserve unknown bits.                 |
| `f`    | `number \| null`         | Device-specific flags integer. Bit meanings depend on the originating device or protocol.                                                                 |
| `mf`   | `number \| null`         | Extended device-specific flags integer. Bit meanings depend on the originating device or protocol.                                                        |
| `mi`   | `number \| null`         | Device-specific miscellaneous information integer; the bit layout is unspecified.                                                                         |
| `hb`   | `number \| null`         | Heart-rate sample (heartbeat); scale and missing-value sentinels are not constrained.                                                                     |
| `b`    | `number \| null`         | Compass bearing sample (bearing); angular reference and scale are unspecified.                                                                            |
| `sp`   | `number \| null`         | Rebreather setpoint sample (setPoint); the stored pressure scale is unspecified.                                                                          |
| `cn`   | `number \| null`         | CNS oxygen-exposure sample (cns); scaling is unspecified.                                                                                                 |
| `gm`   | `DiveGasMix \| null`     | Breathing-gas mixture active at this sample (gasMix).                                                                                                     |
| `gn`   | `number \| null`         | Current gradient factor (gfNow); scaling is unspecified.                                                                                                  |
| `gs`   | `number \| null`         | Predicted gradient factor at the surface (gfSurf); scaling is unspecified.                                                                                |
| `dt`   | `number \| null`         | Decompression-time sample (decoTime); its time unit is unspecified across producers.                                                                      |
| `de`   | `DecoStop \| null`       | Current decompression-stop record (currentDecoStop).                                                                                                      |
| `dde`  | `DecoStop \| null`       | Deepest decompression-stop record (deepestDecoStop).                                                                                                      |
| `su`   | `boolean \| null`        | Device show-up indicator (showUpActive); the exact device/UI trigger is unspecified.                                                                      |
| `st`   | `number \| null`         | Semi-closed-circuit time value (scrTime); its time unit is unspecified.                                                                                   |
| `ndl`  | `number \| null`         | No-decompression-limit sample (ndl); the time unit and sentinel values are unspecified.                                                                   |
| `asc`  | `number \| null`         | Device ascent indicator (asc); its encoding is unspecified, so it is not treated as a boolean or a speed unit.                                            |
| `dr`   | `boolean \| null`        | Whether decompression is required at this sample (decoRequired).                                                                                          |
| `h`    | `number \| null`         | Head-up-display status integer (hudStatus); status-code meanings are unspecified.                                                                         |
| `o2l`  | `number \| null`         | Breathing-loop oxygen sample (o2Loop); unit and scaling are unspecified.                                                                                  |
| `o`    | `boolean \| null`        | Open-circuit mode indicator (oc).                                                                                                                         |
| `rv`   | `number \| null`         | Compact record-format version (recordVersion); allowed versions are not constrained.                                                                      |
| `ba`   | `number \| null`         | Device battery-level sample (batteryLevel); range and scaling are unspecified.                                                                            |
| `loc`  | `JsonValue \| null`      | Sample location, commonly [latitude, longitude]. Legacy representations remain accepted as JsonValue.                                                     |
| `wa`   | `number \| null`         | Apple Watch alarm bitmask (watchAlarmsBitmask), decoded using the watch-specific alarm table.                                                             |
| `ha`   | `number \| null`         | Underwater-housing alarm bitmask (housingAlarmsBitmask), decoded using the housing-specific alarm table.                                                  |
| `hpb`  | `number \| null`         | Phone battery level reported by the underwater housing (housingPhoneBatteryLevel); range and scaling are unspecified.                                     |
| `lda`  | `number \| null`         | Alarm bitmask for libdivecomputer-origin records. Its layout is distinct from native event IDs, transition flags, and the a field; preserve unknown bits. |
| `sdid` | `number \| null`         | Sub-dive identifier within a session (subDiveId); numbering and grouping rules are unspecified.                                                           |

## DiveUploadResponse

| Field              | Type                | Description                                                        |
| ------------------ | ------------------- | ------------------------------------------------------------------ |
| `result`           | `JsonValue \| null` | Raw save result; no universal success convention is assumed.       |
| `divestats`        | `JsonValue \| null` | Post-save statistics value; nested structure is unspecified.       |
| `logbook_history`  | `JsonValue \| null` | Post-save logbook history value; nested structure is unspecified.  |
| `dive`             | `JsonValue \| null` | Returned dive value; its envelope/shape is unspecified.            |
| `success`          | `JsonValue \| null` | Optional success marker; raw representation is unspecified.        |
| `ok`               | `JsonValue \| null` | Optional OK marker; raw representation is unspecified.             |
| `deleted`          | `JsonValue \| null` | Optional deletion result; raw representation is unspecified.       |
| `odin_user_log_id` | `JsonValue \| null` | Optional saved dive identifier; raw representation is unspecified. |

## DivelogResponse

| Field             | Type                | Description                                                |
| ----------------- | ------------------- | ---------------------------------------------------------- |
| `logbook_stats`   | `JsonValue \| null` | Aggregate logbook statistics; nested shape is unspecified. |
| `logbook_history` | `JsonValue \| null` | Logbook history/summary data; nested shape is unspecified. |
| `logbook_details` | `DiveLog[] \| null` | Dive-log records returned for the account.                 |
| `logbook_sites`   | `Site[] \| null`    | Dive-site records associated with the returned logs.       |

## EmergencyContact

| Field             | Type                | Description                                                        |
| ----------------- | ------------------- | ------------------------------------------------------------------ |
| `internalPk`      | `number \| null`    | Primary key in the app’s local database; not a server identifier.  |
| `uec_id`          | `number \| null`    | Server emergency-contact identifier.                               |
| `localRefId`      | `number \| null`    | Local reference used before a server identifier is available.      |
| `uec_mid`         | `number \| null`    | Master user identifier owning the contact.                         |
| `uec_priority`    | `number \| null`    | Contact priority/order value.                                      |
| `uec_name`        | `string \| null`    | Emergency contact name.                                            |
| `uec_email`       | `string \| null`    | Emergency contact email.                                           |
| `uec_phone`       | `string \| null`    | Emergency contact phone.                                           |
| `uec_relation`    | `string \| null`    | Relationship to the user; enum/raw encoding is unspecified.        |
| `uec_contact_mid` | `number \| null`    | Master user identifier of a linked contact account.                |
| `uec_deleted`     | `boolean \| null`   | Contact deletion marker.                                           |
| `uec_updated_by`  | `string \| null`    | Identifier of the last updater; raw representation is unspecified. |
| `uec_timestamp`   | `JsonValue \| null` | Last update timestamp; raw date encoding is unspecified.           |
| `needsUpload`     | `boolean \| null`   | Whether the local record is queued for synchronization.            |

## FreeDiveSessionChart

| Field       | Type                                     | Description                                                                                                                                                                      |
| ----------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `depth_max` | `number \| null`                         | Maximum depth summary for this freedive; sign/unit conventions across sources are not constrained.                                                                               |
| `dive_time` | `number \| null`                         | Duration of this freedive, used as seconds when building the chart.                                                                                                              |
| `sf_time`   | `number \| null`                         | Surface-interval value associated with this freedive; its unit is unspecified.                                                                                                   |
| `temp_min`  | `number \| null`                         | Minimum temperature summary for this freedive; scale is not constrained.                                                                                                         |
| `depth_set` | `JsonString<(number \| null)[]> \| null` | JSON text containing the freedive’s nullable numeric depth series. Decode with decodeJsonField("FreeDiveSessionChart", "depth_set", text); the wire value remains a string.      |
| `temp_set`  | `JsonString<(number \| null)[]> \| null` | JSON text containing the freedive’s nullable numeric temperature series. Decode with decodeJsonField("FreeDiveSessionChart", "temp_set", text); the wire value remains a string. |

## Gear

| Field                      | Type                 | Description                                                                |
| -------------------------- | -------------------- | -------------------------------------------------------------------------- |
| `internalPk`               | `number \| null`     | Primary key in the app’s local database; not a server identifier.          |
| `gear_id`                  | `number \| null`     | Equipment record identifier.                                               |
| `gear_user_master_id`      | `number \| null`     | Master user identifier that owns this equipment.                           |
| `gear_deleted`             | `number \| null`     | Equipment record deleted.                                                  |
| `gear_manufacturer_id`     | `number \| null`     | Manufacturer identifier for this equipment record.                         |
| `gear_manufacturer_misc`   | `string \| null`     | Free-text manufacturer name when no catalog manufacturer is selected.      |
| `gear_main_cat_id`         | `number \| null`     | Equipment category identifier.                                             |
| `gear_main_product_id`     | `number \| null`     | Catalog product identifier.                                                |
| `gear_product_name_modell` | `string \| null`     | Equipment product/model name; spelling follows the wire key.               |
| `gear_buy_date`            | `JsonValue \| null`  | Purchase date; raw date encoding is unspecified.                           |
| `gear_product_serial`      | `string \| null`     | Equipment serial number.                                                   |
| `gear_buy_dealer`          | `string \| null`     | Dealer/store where the equipment was purchased.                            |
| `gear_date_last_service`   | `JsonValue \| null`  | Last service date; raw date encoding is unspecified.                       |
| `gear_date_next_service`   | `JsonValue \| null`  | Next service date; raw date encoding is unspecified.                       |
| `gear_comment`             | `string \| null`     | Equipment record comment.                                                  |
| `timestamp`                | `JsonValue \| null`  | Record timestamp; wire date format and timezone are unspecified.           |
| `gear_images`              | `GearImages \| null` | Equipment images grouped into image/file collections of GearImage records. |
| `gear_bluetooth_address`   | `string \| null`     | Bluetooth address/identifier associated with the equipment.                |
| `gear_used_count`          | `number \| null`     | Recorded equipment-use count.                                              |
| `needsUpload`              | `boolean \| null`    | Whether the local record is queued for synchronization.                    |

## GearImage

| Field                       | Type              | Description                                             |
| --------------------------- | ----------------- | ------------------------------------------------------- |
| `gear_image_id`             | `number \| null`  | Server equipment-image identifier.                      |
| `gear_image_gear_id`        | `number \| null`  | Identifier of the owning equipment record.              |
| `gear_image_master_id`      | `number \| null`  | Master user identifier owning this image.               |
| `gear_image_path`           | `string \| null`  | Stored image/file path.                                 |
| `gear_image_uploaded`       | `string \| null`  | Upload-state value; its wire encoding is unspecified.   |
| `gear_image_filesize`       | `number \| null`  | Image/file size; wire unit is not independently proved. |
| `gear_image_filesize_human` | `string \| null`  | Human-readable image/file size label.                   |
| `timestamp_img`             | `string \| null`  | Image timestamp string; date encoding is unspecified.   |
| `gear_image_url`            | `string \| null`  | Resolved image URL.                                     |
| `needsUpload`               | `boolean \| null` | Whether the local record is queued for synchronization. |

## GearImageData

| Field             | Type                | Description                                                                      |
| ----------------- | ------------------- | -------------------------------------------------------------------------------- |
| `gear_id`         | `number \| null`    | Equipment record identifier.                                                     |
| `gear_image_type` | `JsonValue \| null` | Equipment-image category selector; raw representation is unspecified.            |
| `base64`          | `string \| null`    | Base64-encoded image payload; data-URL prefix handling is not fully established. |

## GearImages

| Field   | Type                  | Description                                                                 |
| ------- | --------------------- | --------------------------------------------------------------------------- |
| `image` | `GearImage[] \| null` | Image-category GearImage records.                                           |
| `file`  | `GearImage[] \| null` | File-category GearImage records; entries are objects, not filename strings. |

## GearSet

| Field                 | Type                | Description                                                         |
| --------------------- | ------------------- | ------------------------------------------------------------------- |
| `internalPk`          | `number \| null`    | Primary key in the app’s local database; not a server identifier.   |
| `gearset_id`          | `number \| null`    | Id identifier for this equipment set.                               |
| `gearset_mid`         | `number \| null`    | Master user identifier that owns the equipment set.                 |
| `gearset_name`        | `string \| null`    | Equipment set name.                                                 |
| `gearset_description` | `string \| null`    | Equipment set description.                                          |
| `gearset_created`     | `JsonValue \| null` | Equipment set created. Its raw JSON representation is not narrowed. |
| `gearset_updated`     | `JsonValue \| null` | Equipment set updated. Its raw JSON representation is not narrowed. |
| `gearset_deleted`     | `boolean \| null`   | Equipment set deleted.                                              |
| `gear`                | `number[] \| null`  | Identifiers of equipment included in this set.                      |
| `needsUpload`         | `boolean \| null`   | Whether the local record is queued for synchronization.             |

## KnowledgeTable

| Field          | Type                     | Description                                                  |
| -------------- | ------------------------ | ------------------------------------------------------------ |
| `id`           | `number \| null`         | Record identifier.                                           |
| `category`     | `string \| null`         | Category identifier or code; allowed values are unspecified. |
| `program`      | `string \| null`         | Associated training program code.                            |
| `tx_key`       | `string \| null`         | Translation lookup key.                                      |
| `name_default` | `string \| null`         | Fallback display name when a translation is unavailable.     |
| `thumb`        | `string \| null`         | Thumbnail image reference.                                   |
| `type`         | `string \| null`         | App-specific type code; allowed values are unspecified.      |
| `content`      | `TableContent[] \| null` | Reference table content.                                     |

## NewEmailData

| Field           | Type                | Description                                                  |
| --------------- | ------------------- | ------------------------------------------------------------ |
| `current_email` | `string \| null`    | Current account email.                                       |
| `current_pwd`   | `string \| null`    | Current account password used to authorize the email change. |
| `new_email`     | `string \| null`    | Requested replacement email address.                         |
| `user_id`       | `JsonValue \| null` | User identifier; raw wire representation is not narrowed.    |

## NewPasswordData

| Field           | Type                | Description                                               |
| --------------- | ------------------- | --------------------------------------------------------- |
| `current_email` | `string \| null`    | Current account email.                                    |
| `current_pwd`   | `string \| null`    | Current account password.                                 |
| `new_pwd`       | `string \| null`    | Requested replacement password.                           |
| `user_id`       | `JsonValue \| null` | User identifier; raw wire representation is not narrowed. |

## PressureRecord

| Field | Type             | Description                                                                                            |
| ----- | ---------------- | ------------------------------------------------------------------------------------------------------ |
| `t`   | `number \| null` | Tank index, not a time value. Mares-origin records use 0 for the first tank; other devices may differ. |
| `v`   | `number \| null` | Tank-pressure reading (value). The source’s pressure scale is not universally established.             |

## PrivacySettingsData

| Field                      | Type                | Description                                                                      |
| -------------------------- | ------------------- | -------------------------------------------------------------------------------- |
| `user_id`                  | `JsonValue \| null` | User identifier; raw wire representation is not narrowed.                        |
| `address`                  | `JsonValue \| null` | Address-visibility preference; raw scope encoding is unspecified.                |
| `allergies`                | `JsonValue \| null` | Allergy-information visibility preference; raw scope encoding is unspecified.    |
| `ccards`                   | `JsonValue \| null` | Certification-card visibility preference; raw scope encoding is unspecified.     |
| `emergency`                | `JsonValue \| null` | Emergency-contact visibility preference; raw scope encoding is unspecified.      |
| `equipmentlist`            | `JsonValue \| null` | Equipment-list visibility preference; raw scope encoding is unspecified.         |
| `logbook`                  | `JsonValue \| null` | Logbook visibility preference; raw scope encoding is unspecified.                |
| `sizingtable`              | `JsonValue \| null` | Sizing-table visibility preference; raw scope encoding is unspecified.           |
| `buddy_finder`             | `JsonValue \| null` | Buddy-finder privacy/discoverability value; raw encoding is unspecified.         |
| `hide_recent_certs_online` | `JsonValue \| null` | Preference for hiding recent certifications online; raw encoding is unspecified. |
| `use_record_data`          | `JsonValue \| null` | Consent/preference for use of record data; raw encoding is unspecified.          |
| `marketing_consent`        | `JsonValue \| null` | Marketing-consent preference; raw encoding is unspecified.                       |

## ProfileImageData

| Field    | Type             | Description                                                                      |
| -------- | ---------------- | -------------------------------------------------------------------------------- |
| `base64` | `string \| null` | Base64-encoded image payload; data-URL prefix handling is not fully established. |

## Site

| Field                              | Type               | Description                                                                                      |
| ---------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| `internalPk`                       | `number \| null`   | Primary key in the app’s local database; not a server identifier.                                |
| `odin_dive_sites_id`               | `number \| null`   | Server dive-site identifier.                                                                     |
| `odin_dive_sites_name`             | `string \| null`   | Dive site name.                                                                                  |
| `bow`                              | `string \| null`   | App bow site marker; its meaning and allowed values are unspecified.                             |
| `odin_user_log_animal_ids`         | `number[] \| null` | Wildlife identifiers associated with this site.                                                  |
| `odin_dive_sites_lon`              | `number \| null`   | Dive site lon.                                                                                   |
| `odin_dive_sites_lat`              | `number \| null`   | Dive site lat.                                                                                   |
| `odin_dive_sites_meta_address`     | `string \| null`   | Dive site meta address.                                                                          |
| `odin_dive_sites_meta_region`      | `string \| null`   | Dive site meta region.                                                                           |
| `odin_dive_sites_meta_country`     | `string \| null`   | Dive site meta country.                                                                          |
| `odin_countries_code_iso`          | `string \| null`   | Dive site odin countries code iso.                                                               |
| `odin_dive_sites_regions_name`     | `string \| null`   | Dive site regions name.                                                                          |
| `odin_dive_sites_areas_name`       | `string \| null`   | Dive site areas name.                                                                            |
| `odin_dive_sites_geo_locked`       | `boolean \| null`  | Whether the site’s geographic position is locked.                                                |
| `odin_dive_sites_is_private`       | `boolean \| null`  | Whether the site is private.                                                                     |
| `odin_dive_sites_alias_ids`        | `string \| null`   | Alternate site identifiers; raw encoding is unspecified.                                         |
| `odin_dive_sites_is_private_owner` | `number \| null`   | Private-site ownership marker; the identifier/boolean convention is unspecified.                 |
| `odin_dive_sites_deleted`          | `boolean \| null`  | Site deletion marker.                                                                            |
| `needsUpload`                      | `boolean \| null`  | Whether the local record is queued for synchronization.                                          |
| `alias_names_search`               | `string \| null`   | App search text assembled from alternate site names.                                             |
| `alias_names`                      | `string \| null`   | Alternate site names; the wire representation is not established by the storage converter alone. |

## SiteDescriptionData

| Field                | Type             | Description                                                          |
| -------------------- | ---------------- | -------------------------------------------------------------------- |
| `iso3`               | `string \| null` | Three-letter language code.                                          |
| `descr1`             | `string \| null` | First uploaded description section; section meaning is unspecified.  |
| `descr2`             | `string \| null` | Second uploaded description section; section meaning is unspecified. |
| `descr3`             | `string \| null` | Third uploaded description section; section meaning is unspecified.  |
| `odin_dive_sites_id` | `number \| null` | Id identifier for this record.                                       |

## SiteDetail

| Field                            | Type                              | Description                                                                                                                                                                                                   |
| -------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dive_site_id`                   | `number \| null`                  | Server dive-site identifier.                                                                                                                                                                                  |
| `dive_site_name`                 | `string \| null`                  | Dive-site display name.                                                                                                                                                                                       |
| `odin_dive_sites_lat`            | `number \| null`                  | Dive-site latitude.                                                                                                                                                                                           |
| `odin_dive_sites_lon`            | `number \| null`                  | Dive-site longitude.                                                                                                                                                                                          |
| `odin_dive_sites_is_private`     | `boolean \| null`                 | Whether the dive site is private.                                                                                                                                                                             |
| `bow`                            | `string \| null`                  | App bow site marker; its meaning and allowed values are unspecified.                                                                                                                                          |
| `dives_logged_by_divers`         | `number \| null`                  | Count/summary of divers contributing logs; exact aggregation is unspecified.                                                                                                                                  |
| `total_logged_dives`             | `number \| null`                  | Total dive-log count associated with the site.                                                                                                                                                                |
| `logged_dives_user_avg`          | `number \| null`                  | Average logged dives per user at the site.                                                                                                                                                                    |
| `avg_max_depth_logged`           | `number \| null`                  | Average maximum depth of logged dives; wire unit is unspecified.                                                                                                                                              |
| `avg_divetime_logged`            | `number \| null`                  | Average duration of logged dives; wire time unit is unspecified.                                                                                                                                              |
| `avg_log_rating`                 | `number \| null`                  | Aggregate rating value for logged dives; scale is unspecified.                                                                                                                                                |
| `avg_log_rating_dives`           | `number \| null`                  | Dive count used in the rating summary.                                                                                                                                                                        |
| `avg_log_rating_details`         | `JsonString<JsonObject> \| null`  | JSON text containing a rating-breakdown object. Object keys and value shapes are not constrained. Decode with decodeJsonField("SiteDetail", "avg_log_rating_details", text); the wire value remains a string. |
| `avg_log_rating_per_month`       | `JsonString<JsonObject> \| null`  | JSON text containing ratings grouped by month. Month keys and values remain JSON. Decode with decodeJsonField("SiteDetail", "avg_log_rating_per_month", text); the wire value remains a string.               |
| `avg_logged_dives_per_month`     | `string \| null`                  | Monthly logged-dive summary string; JSON encoding/structure is not established.                                                                                                                               |
| `temp_month_avg`                 | `JsonString<JsonObject> \| null`  | JSON text containing temperature summaries grouped by month. Units and value structures are unspecified. Decode with decodeJsonField("SiteDetail", "temp_month_avg", text); the wire value remains a string.  |
| `current`                        | `JsonString<JsonObject> \| null`  | JSON text containing the site’s current-condition summary object. Category keys remain unconstrained. Decode with decodeJsonField("SiteDetail", "current", text); the wire value remains a string.            |
| `diveType`                       | `string \| null`                  | Dive-type summary string; category encoding is unspecified.                                                                                                                                                   |
| `entryTypes`                     | `string \| null`                  | Site-entry-type summary string; category encoding is unspecified.                                                                                                                                             |
| `odin_dive_sites_content`        | `string \| null`                  | Dive-site content string; its internal representation is unspecified.                                                                                                                                         |
| `odin_dive_sites_content_mapper` | `string \| null`                  | Site-content mapping string; its internal representation is unspecified.                                                                                                                                      |
| `sightings`                      | `string \| null`                  | Wildlife-sightings summary string; its internal representation is unspecified.                                                                                                                                |
| `odin_user_log_animal_ids`       | `string \| null`                  | Wildlife-reference string associated with the site. Its encoding differs from the list field on Site.                                                                                                         |
| `descr`                          | `SiteDetailDescription[] \| null` | Localized dive-site description records.                                                                                                                                                                      |
| `images`                         | `SiteDetailImage[] \| null`       | Dive-site image records.                                                                                                                                                                                      |
| `breadcrump_string`              | `string \| null`                  | Breadcrumb/navigation text; the misspelling is the wire key.                                                                                                                                                  |

## SiteDetailDescription

| Field              | Type             | Description                                                                                        |
| ------------------ | ---------------- | -------------------------------------------------------------------------------------------------- |
| `descr_site_id`    | `number \| null` | Dive-site identifier for this description.                                                         |
| `descr_iso3`       | `string \| null` | Three-letter language code of this description.                                                    |
| `descr_1`          | `string \| null` | First description section; section title/meaning is unspecified.                                   |
| `descr_2`          | `string \| null` | Second description section; section title/meaning is unspecified.                                  |
| `descr_3`          | `string \| null` | Third description section; section title/meaning is unspecified.                                   |
| `descr_who`        | `string \| null` | Description author/contributor reference; representation is not narrowed beyond its observed type. |
| `descr_added_date` | `string \| null` | Description creation date string; the exact date format is unspecified.                            |

## SiteDetailImage

| Field       | Type             | Description                                                                 |
| ----------- | ---------------- | --------------------------------------------------------------------------- |
| `big`       | `string \| null` | Full-size image URL/reference.                                              |
| `thumb`     | `string \| null` | Thumbnail image URL/reference.                                              |
| `timestamp` | `string \| null` | Image timestamp string; its exact date format and timezone are unspecified. |
| `copyright` | `string \| null` | Copyright or attribution text.                                              |

## SiteImageData

| Field                | Type             | Description                                                                                                |
| -------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| `odin_dive_sites_id` | `number \| null` | Id identifier for this record.                                                                             |
| `img_type`           | `string \| null` | Image-category selector used by the site upload.                                                           |
| `terms_checked`      | `string \| null` | Terms-consent value; the string codes are not normalized. Set only for consent actually given by the user. |
| `ofn`                | `string \| null` | Original filename supplied with the site image.                                                            |
| `base64`             | `string \| null` | Base64-encoded image payload; data-URL prefix handling is not fully established.                           |

## SitesResponse

| Field       | Type             | Description        |
| ----------- | ---------------- | ------------------ |
| `divesites` | `Site[] \| null` | Dive-site records. |

## TableContent

| Field             | Type             | Description                                             |
| ----------------- | ---------------- | ------------------------------------------------------- |
| `iso3`            | `string \| null` | Three-letter language code.                             |
| `iso2`            | `string \| null` | Two-letter language code.                               |
| `language_title`  | `string \| null` | Language display title.                                 |
| `language_native` | `string \| null` | Language name in its native language.                   |
| `name`            | `string \| null` | Display name.                                           |
| `type`            | `string \| null` | App-specific type code; allowed values are unspecified. |
| `file`            | `string \| null` | Downloadable file reference.                            |
| `bytes`           | `number \| null` | Resource size in bytes.                                 |

## TablesResponse

| Field        | Type                       | Description                                                     |
| ------------ | -------------------------- | --------------------------------------------------------------- |
| `categories` | `JsonValue \| null`        | Reference-table category metadata; nested shape is unspecified. |
| `elements`   | `KnowledgeTable[] \| null` | Reference-table records.                                        |

## User

| Field                       | Type                | Description                                                                                                 |
| --------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `authenticated`             | `boolean \| null`   | Whether authentication succeeded for this response.                                                         |
| `user_email`                | `string \| null`    | User profile email.                                                                                         |
| `mid`                       | `number \| null`    | Master user identifier returned by authentication.                                                          |
| `token`                     | `string \| null`    | Session token returned after successful authentication. Keep it private; the client stores it per instance. |
| `user_language`             | `JsonValue \| null` | Preferred user language; its code system and raw representation are unspecified.                            |
| `imperial`                  | `boolean \| null`   | Whether the profile uses imperial units.                                                                    |
| `user_id`                   | `JsonValue \| null` | User identifier; raw wire representation is not narrowed.                                                   |
| `user_leader_nr`            | `JsonValue \| null` | Leader/instructor registration number; raw representation is preserved.                                     |
| `user_facility_id`          | `JsonValue \| null` | Facility identifier for this user profile. Its raw JSON representation is not narrowed.                     |
| `user_title`                | `JsonValue \| null` | User profile title. Its raw JSON representation is not narrowed.                                            |
| `user_forename`             | `JsonValue \| null` | Given name; the raw value is not restricted to a string-only contract.                                      |
| `user_middlename`           | `JsonValue \| null` | Middle name(s); raw representation is preserved.                                                            |
| `user_lastname`             | `JsonValue \| null` | Family name; raw representation is preserved.                                                               |
| `user_street`               | `JsonValue \| null` | User profile street. Its raw JSON representation is not narrowed.                                           |
| `user_street2`              | `JsonValue \| null` | User profile street2. Its raw JSON representation is not narrowed.                                          |
| `user_zip`                  | `JsonValue \| null` | User profile zip. Its raw JSON representation is not narrowed.                                              |
| `user_city`                 | `JsonValue \| null` | User profile city. Its raw JSON representation is not narrowed.                                             |
| `user_state`                | `JsonValue \| null` | User profile state. Its raw JSON representation is not narrowed.                                            |
| `user_country`              | `JsonValue \| null` | User profile country. Its raw JSON representation is not narrowed.                                          |
| `user_country_long`         | `JsonValue \| null` | Long/display form of the user’s country.                                                                    |
| `user_mobile_c`             | `JsonValue \| null` | Contact mobile telephone value; raw representation is preserved.                                            |
| `user_phone_c`              | `JsonValue \| null` | Contact telephone value; raw representation is preserved.                                                   |
| `user_birthday`             | `string \| null`    | User profile birthday.                                                                                      |
| `user_gender`               | `string \| null`    | User profile gender.                                                                                        |
| `user_status`               | `JsonValue \| null` | Account/status value; allowed codes are unspecified.                                                        |
| `user_diving_since`         | `JsonValue \| null` | Start year/date of scuba diving; raw representation is preserved.                                           |
| `user_no_dives`             | `JsonValue \| null` | Profile-reported scuba dive count; raw string/number representation is preserved.                           |
| `user_freediving_since`     | `JsonValue \| null` | Start year/date of freediving; raw representation is preserved.                                             |
| `user_no_freedives`         | `JsonValue \| null` | Profile-reported freedive count; raw string/number representation is preserved.                             |
| `user_image`                | `string \| null`    | User profile image.                                                                                         |
| `user_units`                | `string \| null`    | App’s saved unit-preference representation; do not assume it duplicates imperial.                           |
| `privacy_required`          | `boolean \| null`   | Whether a privacy acknowledgment is required.                                                               |
| `privacy_settings_required` | `boolean \| null`   | Whether privacy settings must be completed.                                                                 |
| `privacy_settings`          | `JsonValue \| null` | Profile privacy configuration; its nested server structure is unspecified.                                  |
| `apis`                      | `JsonValue \| null` | API routing configuration returned by the server; its raw structure is unspecified.                         |
| `my_divessi_url`            | `JsonValue \| null` | MySSI web routing/link configuration; its raw wire shape remains JsonValue.                                 |
| `ems_apis`                  | `JsonValue \| null` | Training/EMS API routing configuration; its raw wire shape remains JsonValue.                               |
| `pro`                       | `JsonValue \| null` | Professional-user information; its raw wire structure is unspecified.                                       |
| `needsUpload`               | `boolean \| null`   | Whether the local record is queued for synchronization.                                                     |
| `documents`                 | `JsonValue \| null` | User document configuration/list; its nested server structure is unspecified.                               |
| `can_test_webview`          | `boolean \| null`   | Whether the app enables its webview testing capability.                                                     |
| `user_app_settings`         | `JsonValue \| null` | Saved app settings; their raw wire representation remains unspecified.                                      |

## Request inputs

These fields are operation parameters. Required input objects can contain sparse model values; their server-side requirements remain unspecified.

### BuddiesSearchInput

| Field    | Type     | Required | Description         |
| -------- | -------- | -------- | ------------------- |
| `string` | `string` | Yes      | Search/filter text. |

### CentersInput

| Field | Type     | Required | Description                              |
| ----- | -------- | -------- | ---------------------------------------- |
| `lat` | `number` | Yes      | Latitude of the search/location origin.  |
| `lon` | `number` | Yes      | Longitude of the search/location origin. |

### LoginInput

| Field | Type     | Required | Description                                     |
| ----- | -------- | -------- | ----------------------------------------------- |
| `l`   | `string` | Yes      | Account login/email supplied to authentication. |
| `p`   | `string` | Yes      | Account password supplied to authentication.    |

### SiteInput

| Field  | Type         | Required | Description           |
| ------ | ------------ | -------- | --------------------- |
| `dsid` | `Identifier` | Yes      | Dive-site identifier. |

### SiteDetailInput

| Field     | Type         | Required | Description           |
| --------- | ------------ | -------- | --------------------- |
| `site_id` | `Identifier` | Yes      | Dive-site identifier. |

### SitesInput

| Field       | Type     | Required | Description                                                        |
| ----------- | -------- | -------- | ------------------------------------------------------------------ |
| `last_sync` | `number` | Yes      | Incremental synchronization marker; timestamp unit is unspecified. |
| `offset`    | `number` | No       | Offset into the result listing.                                    |
| `limit`     | `number` | No       | Maximum number of requested listing results.                       |

### BuddyUploadInput

| Field       | Type    | Required | Description                                                                                                                        |
| ----------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `Buddy` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### DeleteGearInput

| Field     | Type         | Required | Description                  |
| --------- | ------------ | -------- | ---------------------------- |
| `gear_id` | `Identifier` | Yes      | Equipment record identifier. |

### DeleteGearImageInput

| Field      | Type         | Required | Description                  |
| ---------- | ------------ | -------- | ---------------------------- |
| `gear_id`  | `Identifier` | Yes      | Equipment record identifier. |
| `image_id` | `Identifier` | Yes      | Image record identifier.     |

### DiveUploadInput

| Field       | Type      | Required | Description                                                                                                                        |
| ----------- | --------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `DiveLog` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### EmergencyContactUploadInput

| Field       | Type               | Required | Description                                                                                                                        |
| ----------- | ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `EmergencyContact` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### GearSetUploadInput

| Field       | Type      | Required | Description                                                                                                                        |
| ----------- | --------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `GearSet` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### GearUploadInput

| Field       | Type   | Required | Description                                                                                                                        |
| ----------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `Gear` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### PrivacySettingsUploadInput

| Field       | Type                  | Required | Description                                                                                                                        |
| ----------- | --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `PrivacySettingsData` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### ProfileImageUploadInput

| Field       | Type               | Required | Description                                                                                                                        |
| ----------- | ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `ProfileImageData` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### ProfileUploadInput

| Field       | Type   | Required | Description                                                                                                                        |
| ----------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `User` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### SaveGearImageInput

| Field       | Type            | Required | Description                                                                                                                        |
| ----------- | --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `GearImageData` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### SaveUserDivecomputerInput

| Field       | Type        | Required | Description                                                                                                                        |
| ----------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `JsonValue` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### SiteDescriptionUploadInput

| Field       | Type                  | Required | Description                                                                                                                        |
| ----------- | --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `SiteDescriptionData` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### SiteImageUploadInput

| Field       | Type            | Required | Description                                                                                                                        |
| ----------- | --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `SiteImageData` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### SiteUploadInput

| Field       | Type   | Required | Description                                                                                                                        |
| ----------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `Site` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### UploadDivelogHistoryInput

| Field       | Type        | Required | Description                                                                                                                        |
| ----------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `JsonValue` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### NewEmailUploadInput

| Field       | Type           | Required | Description                                                                                                                        |
| ----------- | -------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `NewEmailData` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |

### NewPasswordUploadInput

| Field       | Type              | Required | Description                                                                                                                        |
| ----------- | ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `json_data` | `NewPasswordData` | Yes      | Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. |
