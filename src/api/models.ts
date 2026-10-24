import type { JsonValue, JsonObject, JsonString } from '../types.js';

export interface BuddiesResponse {
  [key: string]: JsonValue | undefined;

  user_buddies?: Buddy[] | null;
}

export interface Buddy {
  [key: string]: JsonValue | undefined;

  internalPk?: number | null;

  id?: number | null;

  localRefId?: number | null;

  address?: string | null;

  dob?: JsonValue | null;

  comment?: string | null;

  added?: JsonValue | null;

  email?: string | null;

  firstname?: string | null;

  gender?: number | null;

  image?: string | null;

  lastname?: string | null;

  leader_nr?: number | null;

  leader_active?: boolean | null;

  master_id?: number | null;

  nickname?: string | null;

  phone?: string | null;

  deleted?: boolean | null;

  needsUpload?: boolean | null;

  confirmed?: boolean | null;

  favorite?: boolean | null;
}

export interface BuddyUploadResponse {
  [key: string]: JsonValue | undefined;

  result?: JsonValue | null;

  buddy?: JsonValue | null;
}

export interface Certificate {
  [key: string]: JsonValue | undefined;

  ccard_uid?: string | null;

  ccard_course_id?: string | null;

  ccard_course_name?: string | null;

  ccard_course_short?: string | null;

  ccard_cat?: string | null;

  ccard_cat_title?: string | null;

  ccard_dives?: string | null;

  ccard_issue_date?: JsonValue | null;

  ccard_expire_date?: JsonValue | null;

  ccard_instructor_number?: string | null;

  ccard_instructor_name?: string | null;

  ccard_divecenter_number?: string | null;

  ccard_divecenter_name?: string | null;

  ccard_divecenter_city?: string | null;

  ccard_divecenter_country?: string | null;

  ccard_image_back?: string | null;

  ccard_image_front?: string | null;

  ccard_image_front_thumb?: string | null;
}

export interface CertificatesResponse {
  [key: string]: JsonValue | undefined;

  cat_array?: JsonValue | null;

  ccard_list?: Certificate[] | null;
}

export interface DecoStop {
  [key: string]: JsonValue | undefined;

  d?: number | null;

  t?: number | null;

  ty?: JsonValue | null;

  tts?: number | null;
}

export interface DiveAlarm {
  [key: string]: JsonValue | undefined;

  position?: number | null;

  deco?: JsonValue | null;

  violation?: JsonValue | null;

  speed?: JsonValue | null;

  fast_ascent?: JsonValue | null;

  UNCONTROLLED_ASCENT?: JsonValue | null;

  MOD_REACHED?: JsonValue | null;

  CNS_DANGER?: JsonValue | null;

  CNS_EXTREME?: JsonValue | null;

  MISSED_DECO?: JsonValue | null;

  LOW_BATTERY?: JsonValue | null;

  VERY_LOW_BATTERY?: JsonValue | null;

  PROBE_LOW_BATTERY?: JsonValue | null;

  LOW_TANK_PRESSURE?: JsonValue | null;

  TANK_RESERVE_REACHED?: JsonValue | null;

  TANK_LOST_LINK?: JsonValue | null;

  MAX_DIVE_DEPTH?: JsonValue | null;

  RUN_AWAY_DECO?: JsonValue | null;

  TANK_HALF_REACHED?: JsonValue | null;

  NODECO_2MIN?: JsonValue | null;

  NODECO_DECO?: JsonValue | null;

  MULTIGAS_ATANKISLOW?: JsonValue | null;

  DIVETIME_HALFTIME?: JsonValue | null;

  DIVETIME_FULLTIME?: JsonValue | null;

  GAS_SWITCHPOINT?: JsonValue | null;

  GAS_IGNORED?: JsonValue | null;

  GAS_CHANGED?: JsonValue | null;

  GAS_NOTCHANGED?: JsonValue | null;

  GAS_ADDED?: JsonValue | null;

  RGT_3MIN?: JsonValue | null;

  PSM_ERROR?: JsonValue | null;

  CEILCON_1MIN?: JsonValue | null;
}

export interface DiveCenter {
  [key: string]: JsonValue | undefined;

  dc_id?: JsonValue | null;

  type?: string | null;

  type_title?: string | null;

  type_flags?: string | null;

  type_pro_training?: number | null;

  name?: string | null;

  distance?: number | null;

  city?: string | null;

  country?: string | null;

  tel?: JsonValue | null;

  state?: string | null;

  street?: string | null;

  zip?: number | null;

  email?: string | null;

  logo?: JsonValue | null;

  more?: JsonValue | null;

  lon?: JsonValue | null;

  lat?: JsonValue | null;

  web?: JsonValue | null;

  images?: string[] | null;

  hours?: string | null;
}

export interface DiveGasMix {
  [key: string]: JsonValue | undefined;

  index?: number | null;

  o2?: number | null;

  n2?: number | null;

  he?: number | null;
}

export interface DiveLocationSample {
  [key: string]: JsonValue | undefined;

  lat?: number | null;

  long?: number | null;
}

export interface DiveLog {
  [key: string]: JsonValue | undefined;

  internalPk?: number | null;

  odin_user_log_id?: number | null;

  odin_user_log_datetime?: JsonValue | null;

  odin_user_log_depth_m?: number | null;

  odin_user_log_depth_ft?: number | null;

  odin_user_log_avg_depth_m?: number | null;

  odin_user_log_avg_depth_ft?: number | null;

  odin_user_log_divetime?: number | null;

  odin_user_log_nr?: number | null;

  odin_user_log_dive_type?: number | null;

  odin_user_log_rating?: number | null;

  odin_user_log_airtemp_c?: number | null;

  odin_user_log_airtemp_f?: number | null;

  odin_user_log_watertemp_c?: number | null;

  odin_user_log_watertemp_f?: number | null;

  odin_user_log_pressure_start_bar?: number | null;

  odin_user_log_pressure_start_psi?: number | null;

  odin_user_log_pressure_end_bar?: number | null;

  odin_user_log_pressure_end_psi?: number | null;

  odin_user_log_dive_sites_id?: number | null;

  localSiteId?: number | null;

  odin_user_log_buddy_ids?: number[] | null;

  log_linked_facility_id?: number | null;

  localBuddyIds?: number[] | null;

  odin_user_log_animal_ids?: number[] | null;

  odin_user_log_gear?: number[] | null;

  odin_user_log_user_master_id?: number | null;

  odin_user_log_leader_nr?: string | null;

  odin_user_log_comment?: string | null;

  odin_user_log_crdate?: JsonValue | null;

  odin_user_log_deleted?: boolean | null;

  reset_profile_divelog_number_with_deletion?: boolean | null;

  odin_user_log_var_divetype_id?: number | null;

  odin_user_log_var_water_body_id?: number | null;

  odin_user_log_var_watertype_id?: number | null;

  odin_user_log_var_entry_id?: number | null;

  odin_user_log_var_current_id?: number | null;

  odin_user_log_var_surface_id?: number | null;

  odin_user_log_var_weather_id?: number | null;

  odin_user_log_var_tanktype_id?: number | null;

  odin_user_log_vis_m?: number | null;

  odin_user_log_vis_ft?: number | null;

  odin_user_log_weight_kg?: number | null;

  odin_user_log_weight_lb?: number | null;

  odin_user_log_tank_vol_l?: number | null;

  odin_user_log_tank_vol_cuft?: number | null;

  odin_user_log_ean?: boolean | null;

  odin_user_log_ean_percent?: number | null;

  odin_user_log_var_specialdive_id?: string | null;

  odin_user_log_amv_l?: number | null;

  odin_user_log_amv_psi?: number | null;

  odin_user_log_frd_suit?: string | null;

  odin_user_log_frd_weight_kg?: number | null;

  odin_user_log_frd_weight_lb?: number | null;

  odin_user_log_frd_neutral_m?: number | null;

  odin_user_log_frd_neutral_ft?: number | null;

  odin_user_log_frd_divetype_id?: number | null;

  odin_user_log_frdwater_body_id?: number | null;

  odin_user_log_frddisc_STA?: number | null;

  odin_user_log_frddisc_STA_WU?: number | null;

  odin_user_log_frddisc_STA_MAX?: number | null;

  odin_user_log_frddisc_STA_CT?: number | null;

  odin_user_log_frddisc_STATT?: number | null;

  odin_user_log_frddisc_STATT_RP?: number | null;

  odin_user_log_frddisc_STATT_MAX?: number | null;

  odin_user_log_frddisc_WAPN?: number | null;

  odin_user_log_frddisc_WAPN_WU?: number | null;

  odin_user_log_frddisc_WAPN_RP?: number | null;

  odin_user_log_frddisc_WAPN_MAX?: number | null;

  odin_user_log_frddisc_DYN?: number | null;

  odin_user_log_frddisc_DYN_WU?: number | null;

  odin_user_log_frddisc_DYN_MAX_m?: number | null;

  odin_user_log_frddisc_DYN_MAX_ft?: number | null;

  odin_user_log_frddisc_DYNTT?: number | null;

  odin_user_log_frddisc_DYNTT_RP?: number | null;

  odin_user_log_frddisc_DYNTT_MAX_m?: number | null;

  odin_user_log_frddisc_DYNTT_MAX_ft?: number | null;

  odin_user_log_frddisc_FIM?: number | null;

  odin_user_log_frddisc_FIM_WU?: number | null;

  odin_user_log_frddisc_FIM_MAX_m?: number | null;

  odin_user_log_frddisc_FIM_MAX_ft?: number | null;

  odin_user_log_frddisc_FIM_TIME?: string | null;

  odin_user_log_frddisc_CWT?: number | null;

  odin_user_log_frddisc_CWT_WU?: number | null;

  odin_user_log_frddisc_CWT_MAX_m?: number | null;

  odin_user_log_frddisc_CWT_MAX_ft?: number | null;

  odin_user_log_frddisc_CWT_TIME?: string | null;

  odin_user_log_frddisc_CNF?: number | null;

  odin_user_log_frddisc_CNF_WU?: number | null;

  odin_user_log_frddisc_CNF_MAX_m?: number | null;

  odin_user_log_frddisc_CNF_MAX_ft?: number | null;

  odin_user_log_frddisc_CNF_TIME?: string | null;

  odin_user_log_frddisc_VWT?: number | null;

  odin_user_log_frddisc_VWT_WU?: number | null;

  odin_user_log_frddisc_VWT_MAX_m?: number | null;

  odin_user_log_frddisc_VWT_MAX_ft?: number | null;

  odin_user_log_frddisc_VWT_TIME?: string | null;

  odin_user_log_frddisc_FRC?: number | null;

  odin_user_log_frddisc_FRC_RP?: number | null;

  odin_user_log_frddisc_FRC_MAX_m?: number | null;

  odin_user_log_frddisc_FRC_MAX_ft?: number | null;

  odin_user_log_frddisc_DNF?: number | null;

  odin_user_log_frddisc_DNF_WU?: number | null;

  odin_user_log_frddisc_DNF_MAX_m?: number | null;

  odin_user_log_frddisc_DNF_MAX_ft?: number | null;

  odin_user_log_frd_NOTES?: string | null;

  odin_user_log_xr_divetype_id?: number | null;

  odin_user_log_divecenter_confirmed?: boolean | null;

  odin_user_log_transferDate?: string | null;

  odin_user_log_diveComputer?: string | null;

  odin_user_log_diveComputerData?: string | null;

  odin_user_log_depthDataset?: JsonString<(number | null)[]> | null;

  odin_user_log_alarmDataset?: JsonString<DiveAlarm[]> | null;

  timestamp?: JsonValue | null;

  odin_user_log_confirmed?: boolean | null;

  odin_user_log_verified?: boolean | null;

  odin_user_log_divecenter_confirmed_id?: number | null;

  odin_user_log_divecenter_confirmed_name?: string | null;

  odin_user_log_divecenter_confirmed_logo?: string | null;

  odin_user_log_leader_confirmed_id?: number | null;

  odin_user_log_leader_confirmed_name?: string | null;

  odin_user_log_user_confirmed_id?: string | null;

  odin_user_log_user_confirmed_name?: string | null;

  odin_user_log_xr_planned_bottom_time?: number | null;

  odin_user_log_xr_total_deco_time?: number | null;

  odin_user_log_xr_back_tanktype_id?: number | null;

  odin_user_log_xr_deco_tanktype_id?: number | null;

  odin_user_log_xr_back_vol_l?: number | null;

  odin_user_log_xr_deco1_vol_l?: number | null;

  odin_user_log_xr_deco2_vol_l?: number | null;

  odin_user_log_xr_deco3_vol_l?: number | null;

  odin_user_log_xr_back_ean?: number | null;

  odin_user_log_xr_back_tmx?: number | null;

  odin_user_log_xr_deco1_ean?: number | null;

  odin_user_log_xr_deco1_tmx?: number | null;

  odin_user_log_xr_deco2_ean?: number | null;

  odin_user_log_xr_deco2_tmx?: number | null;

  odin_user_log_xr_deco3_ean_o2?: number | null;

  odin_user_log_xr_back_start_bar?: number | null;

  odin_user_log_xr_back_end_bar?: number | null;

  odin_user_log_xr_deco1_start_bar?: number | null;

  odin_user_log_xr_deco1_end_bar?: number | null;

  odin_user_log_xr_deco2_start_bar?: number | null;

  odin_user_log_xr_deco2_end_bar?: number | null;

  odin_user_log_xr_deco3_start_bar?: number | null;

  odin_user_log_xr_deco3_end_bar?: number | null;

  odin_user_log_xr_sac_bottom_l?: number | null;

  odin_user_log_xr_sac_deco_l?: number | null;

  odin_user_log_frddisc?: string | null;

  odin_user_log_gear_details?: string | null;

  odin_user_log_xr_back?: number | null;

  odin_user_log_xr_deco1?: number | null;

  odin_user_log_xr_deco2?: number | null;

  odin_user_log_xr_deco3?: number | null;

  odin_user_log_xr_deco1_tanktype_id?: number | null;

  odin_user_log_xr_deco2_tanktype_id?: number | null;

  odin_user_log_xr_deco3_tanktype_id?: number | null;

  odin_user_log_xr_planned_depth?: number | null;

  odin_user_log_xr_planned_deco_time?: number | null;

  odin_user_log_xr_back_o2?: number | null;

  odin_user_log_xr_back_he?: number | null;

  odin_user_log_xr_deco1_o2?: number | null;

  odin_user_log_xr_deco1_he?: number | null;

  odin_user_log_xr_deco2_o2?: number | null;

  odin_user_log_xr_deco2_he?: number | null;

  odin_user_log_xr_deco3_o2?: number | null;

  odin_user_log_scr_unit_id?: number | null;

  odin_user_log_scr_total_deco_time?: number | null;

  odin_user_log_scr_sac_bailout_l?: number | null;

  odin_user_log_scr_sac_deco_l?: number | null;

  odin_user_log_scr_bottom_tanktype_id?: number | null;

  odin_user_log_scr_bottom_tank_vol_l?: number | null;

  odin_user_log_scr_bottom_o2?: number | null;

  odin_user_log_scr_bottom_setpoint?: number | null;

  odin_user_log_scr_bottom_start_bar?: number | null;

  odin_user_log_scr_bottom_end_bar?: number | null;

  odin_user_log_scr_deco?: number | null;

  odin_user_log_scr_deco_tanktype_id?: number | null;

  odin_user_log_scr_deco_tank_vol_l?: number | null;

  odin_user_log_scr_deco_o2?: number | null;

  odin_user_log_scr_deco_setpoint?: number | null;

  odin_user_log_scr_deco_start_bar?: number | null;

  odin_user_log_scr_deco_end_bar?: number | null;

  odin_user_log_si_before?: number | null;

  odin_user_log_watertemp_max_c?: number | null;

  odin_user_log_watertemp_max_f?: number | null;

  odin_user_log_gf_set?: string | null;

  odin_user_log_gf_set_1?: number | null;

  odin_user_log_gf_set_2?: number | null;

  odin_user_log_gf_end?: number | null;

  odin_user_log_cns_start?: number | null;

  odin_user_log_cns_end?: number | null;

  odin_user_log_otu_start?: number | null;

  odin_user_log_otu_end?: number | null;

  odin_user_log_tempDataset?: JsonString<(number | null)[]> | null;

  odin_user_log_gfnowDataset?: JsonString<(number | null)[]> | null;

  odin_user_log_gfSurfDataset?: JsonString<(number | null)[]> | null;

  odin_user_log_deepestDecoDataset?: JsonString<(number | null)[]> | null;

  odin_user_log_tankPressureDataset?: JsonString<(number | null)[]> | null;

  odin_user_log_freeDiveSessionCharts?: JsonString<FreeDiveSessionChart[]> | null;

  odin_user_log_divecomputer_dive_ref?: string | null;

  odin_user_log_divecomputer_ref?: string | null;

  odin_user_log_divecomputer_imported?: boolean | null;

  needsUpload?: boolean | null;

  odin_user_log_ccr_unit_id?: number | null;

  odin_user_log_ccr_total_deco_time?: number | null;

  odin_user_log_ccr_sac_bailout_l?: number | null;

  odin_user_log_ccr_sac_deco_l?: number | null;

  odin_user_log_ccr_bailout01?: number | null;

  odin_user_log_ccr_bailout01_tanktype_id?: number | null;

  odin_user_log_ccr_bailout01_tank_vol_l?: number | null;

  odin_user_log_ccr_bailout01_o2?: number | null;

  odin_user_log_ccr_bailout01_he?: number | null;

  odin_user_log_ccr_bailout01_start_bar?: number | null;

  odin_user_log_ccr_bailout01_end_bar?: number | null;

  odin_user_log_ccr_bailout02?: number | null;

  odin_user_log_ccr_bailout02_tanktype_id?: number | null;

  odin_user_log_ccr_bailout02_tank_vol_l?: number | null;

  odin_user_log_ccr_bailout02_o2?: number | null;

  odin_user_log_ccr_bailout02_he?: number | null;

  odin_user_log_ccr_bailout02_start_bar?: number | null;

  odin_user_log_ccr_bailout02_end_bar?: number | null;

  odin_user_log_ccr_bailout03?: number | null;

  odin_user_log_ccr_bailout03_tanktype_id?: number | null;

  odin_user_log_ccr_bailout03_tank_vol_l?: number | null;

  odin_user_log_ccr_bailout03_o2?: number | null;

  odin_user_log_ccr_bailout03_he?: number | null;

  odin_user_log_ccr_bailout03_start_bar?: number | null;

  odin_user_log_ccr_bailout03_end_bar?: number | null;

  odin_user_log_ccr_diluent_gas?: number | null;

  odin_user_log_ccr_diluent_tanktype_id?: number | null;

  odin_user_log_ccr_diluent_tank_vol_l?: number | null;

  odin_user_log_ccr_diluent_o2?: number | null;

  odin_user_log_ccr_diluent_he?: number | null;

  odin_user_log_ccr_diluent_start_bar?: number | null;

  odin_user_log_ccr_diluent_end_bar?: number | null;

  odin_user_log_deco_dive?: number | null;

  odin_user_log_deco_time?: number | null;

  odin_user_log_deco_gas?: number | null;

  odin_user_log_deco_gas_tanktype_id?: number | null;

  odin_user_log_deco_gas_tank_vol_l?: number | null;

  odin_user_log_deco_gas_o2?: number | null;

  odin_user_log_deco_gas_start_bar?: number | null;

  odin_user_log_deco_gas_end_bar?: number | null;

  odin_user_log_alarm_fast_ascent?: boolean | null;

  odin_user_log_alarm_deco_stop?: boolean | null;

  odin_user_log_alarm_deco_violation?: boolean | null;

  needsVerificationUpload?: boolean | null;

  needsUnverifyUpload?: boolean | null;

  odin_user_log_deco_gas_tank_vol_cuft?: number | null;

  odin_user_log_deco_gas_start_psi?: number | null;

  odin_user_log_deco_gas_end_psi?: number | null;

  odin_user_log_xr_back_vol_cuft?: number | null;

  odin_user_log_xr_back_start_psi?: number | null;

  odin_user_log_xr_back_end_psi?: number | null;

  odin_user_log_xr_deco1_vol_cuft?: number | null;

  odin_user_log_xr_deco1_start_psi?: number | null;

  odin_user_log_xr_deco1_end_psi?: number | null;

  odin_user_log_xr_deco2_vol_cuft?: number | null;

  odin_user_log_xr_deco2_start_psi?: number | null;

  odin_user_log_xr_deco2_end_psi?: number | null;

  odin_user_log_xr_deco3_vol_cuft?: number | null;

  odin_user_log_xr_deco3_start_psi?: number | null;

  odin_user_log_xr_deco3_end_psi?: number | null;

  odin_user_log_xr_sac_bottom_psi?: number | null;

  odin_user_log_xr_sac_deco_psi?: number | null;

  odin_user_log_xr_deco3_he?: number | null;

  odin_user_log_scr_sac_bailout_psi?: number | null;

  odin_user_log_scr_sac_deco_psi?: number | null;

  odin_user_log_scr_bottom_tank_vol_cuft?: number | null;

  odin_user_log_scr_bottom_start_psi?: number | null;

  odin_user_log_scr_bottom_end_psi?: number | null;

  odin_user_log_scr_deco_tank_vol_cuft?: number | null;

  odin_user_log_scr_deco_start_psi?: number | null;

  odin_user_log_scr_deco_end_psi?: number | null;

  odin_user_log_ccr_sac_bailout_psi?: number | null;

  odin_user_log_ccr_sac_deco_psi?: number | null;

  odin_user_log_ccr_bottom_tank_vol_cuft?: number | null;

  odin_user_log_ccr_o2_start_psi?: number | null;

  odin_user_log_ccr_o2_end_psi?: number | null;

  odin_user_log_ccr_diluent_tank_vol_cuft?: number | null;

  odin_user_log_ccr_diluent_start_psi?: number | null;

  odin_user_log_ccr_diluent_end_psi?: number | null;

  odin_user_log_ccr_bailout01_tank_vol_cuft?: number | null;

  odin_user_log_ccr_bailout01_start_psi?: number | null;

  odin_user_log_ccr_bailout01_end_psi?: number | null;

  odin_user_log_ccr_bailout02_tank_vol_cuft?: number | null;

  odin_user_log_ccr_bailout02_start_psi?: number | null;

  odin_user_log_ccr_bailout02_end_psi?: number | null;

  odin_user_log_ccr_bailout03_tank_vol_cuft?: number | null;

  odin_user_log_ccr_bailout03_start_psi?: number | null;

  odin_user_log_ccr_bailout03_end_psi?: number | null;

  odin_user_log_ccr_o2_tanktype_id?: number | null;

  odin_user_log_ccr_o2_tank_vol_l?: number | null;

  odin_user_log_ccr_o2_tank_vol_cuft?: number | null;

  odin_user_log_ccr_o2_start_bar?: number | null;

  odin_user_log_ccr_o2_end_bar?: number | null;

  log_linked_brevet_rule_id?: number | null;

  uploadError?: string | null;

  odin_user_log_gearconfiguration_id?: number | null;

  log_extended_data_cleanup_weight_kg?: number | null;

  log_extended_data_cleanup_weight_lb?: number | null;

  odin_user_log_divecomputer_serial_nr?: string | null;

  odin_user_log_divecomputer_ble_id?: string | null;

  odin_user_log_divecomputer_id?: number | null;

  odin_user_log_divecomputer_name?: string | null;

  odin_user_log_divecomputer_manufacturer?: string | null;

  odin_user_log_divecomputer_firmware?: string | null;

  odin_user_log_divecomputer_raw_data_header?: string | null;

  odin_user_log_divecomputer_raw_data_details?: string | null;

  odin_user_log_scr_start_time?: number | null;

  odin_user_log_scr_end_time?: number | null;

  odin_user_log_scr_oc?: boolean | null;

  odin_user_log_diveSamples?: JsonString<DiveRecord[]> | null;

  odin_user_log_housing_local_dive_media?: JsonString<JsonValue[]> | null;

  odin_user_log_apple_watch?: boolean | null;

  odin_user_log_apple_watch_log_id?: number | null;

  odin_user_log_apple_watch_id?: number | null;

  odin_user_log_pressureDataset?: string | null;

  odin_user_log_heartRateMin?: number | null;

  odin_user_log_heartRateMax?: number | null;

  odin_user_log_heartRateAvg?: number | null;

  odin_user_log_heartRateDataset?: JsonString<(number | null)[]> | null;

  odin_user_log_batteryLevelDataset?: string | null;

  odin_user_log_batteryLevelStart?: number | null;

  odin_user_log_batteryLevelEnd?: number | null;

  odin_user_log_accelerationDataset?: string | null;

  odin_user_log_gyroDataset?: string | null;

  odin_user_log_pos_start_latitude?: number | null;

  odin_user_log_pos_start_longitude?: number | null;

  odin_user_log_pos_end_latitude?: number | null;

  odin_user_log_pos_end_longitude?: number | null;

  odin_user_log_dive_on_own_risk?: boolean | null;

  odin_user_log_dive_on_own_risk_os_app?: string | null;

  odin_user_log_locationDataset?: JsonString<DiveLocationSample[]> | null;

  odin_user_log_apple_watch_app_version?: string | null;

  odin_user_log_apple_watch_os_version?: string | null;

  log_divecomputer_max_sensor_depth?: number | null;

  log_divecomputer_bottomtimer?: boolean | null;

  odin_user_log_divecomputer_productname?: string | null;

  log_extended_data_latitude?: number | null;

  log_extended_data_longitude?: number | null;

  log_extended_data_conservatism?: number | null;

  log_extended_data_decomodel?: string | null;

  log_extended_data_libdivecomputer_identifier_base64?: string | null;

  odin_user_log_date?: string | null;

  odin_user_log_entry_time?: string | null;
}

export interface DiveRecord {
  [key: string]: JsonValue | undefined;

  n?: number | null;

  t?: number | null;

  d?: number | null;

  p?: number | null;

  te?: number | null;

  s?: number | null;

  pr?: PressureRecord | null;

  a?: number | null;

  f?: number | null;

  mf?: number | null;

  mi?: number | null;

  hb?: number | null;

  b?: number | null;

  sp?: number | null;

  cn?: number | null;

  gm?: DiveGasMix | null;

  gn?: number | null;

  gs?: number | null;

  dt?: number | null;

  de?: DecoStop | null;

  dde?: DecoStop | null;

  su?: boolean | null;

  st?: number | null;

  ndl?: number | null;

  asc?: number | null;

  dr?: boolean | null;

  h?: number | null;

  o2l?: number | null;

  o?: boolean | null;

  rv?: number | null;

  ba?: number | null;

  loc?: JsonValue | null;

  wa?: number | null;

  ha?: number | null;

  hpb?: number | null;

  lda?: number | null;

  sdid?: number | null;
}

export interface DiveUploadResponse {
  [key: string]: JsonValue | undefined;

  result?: JsonValue | null;

  divestats?: JsonValue | null;

  logbook_history?: JsonValue | null;

  dive?: JsonValue | null;

  success?: JsonValue | null;

  ok?: JsonValue | null;

  deleted?: JsonValue | null;

  odin_user_log_id?: JsonValue | null;
}

export interface DivelogResponse {
  [key: string]: JsonValue | undefined;

  logbook_stats?: JsonValue | null;

  logbook_history?: JsonValue | null;

  logbook_details?: DiveLog[] | null;

  logbook_sites?: Site[] | null;
}

export interface EmergencyContact {
  [key: string]: JsonValue | undefined;

  internalPk?: number | null;

  uec_id?: number | null;

  localRefId?: number | null;

  uec_mid?: number | null;

  uec_priority?: number | null;

  uec_name?: string | null;

  uec_email?: string | null;

  uec_phone?: string | null;

  uec_relation?: string | null;

  uec_contact_mid?: number | null;

  uec_deleted?: boolean | null;

  uec_updated_by?: string | null;

  uec_timestamp?: JsonValue | null;

  needsUpload?: boolean | null;
}

export interface FreeDiveSessionChart {
  [key: string]: JsonValue | undefined;

  depth_max?: number | null;

  dive_time?: number | null;

  sf_time?: number | null;

  temp_min?: number | null;

  depth_set?: JsonString<(number | null)[]> | null;

  temp_set?: JsonString<(number | null)[]> | null;
}

export interface Gear {
  [key: string]: JsonValue | undefined;

  internalPk?: number | null;

  gear_id?: number | null;

  gear_user_master_id?: number | null;

  gear_deleted?: number | null;

  gear_manufacturer_id?: number | null;

  gear_manufacturer_misc?: string | null;

  gear_main_cat_id?: number | null;

  gear_main_product_id?: number | null;

  gear_product_name_modell?: string | null;

  gear_buy_date?: JsonValue | null;

  gear_product_serial?: string | null;

  gear_buy_dealer?: string | null;

  gear_date_last_service?: JsonValue | null;

  gear_date_next_service?: JsonValue | null;

  gear_comment?: string | null;

  timestamp?: JsonValue | null;

  gear_images?: GearImages | null;

  gear_bluetooth_address?: string | null;

  gear_used_count?: number | null;

  needsUpload?: boolean | null;
}

export interface GearImage {
  [key: string]: JsonValue | undefined;

  gear_image_id?: number | null;

  gear_image_gear_id?: number | null;

  gear_image_master_id?: number | null;

  gear_image_path?: string | null;

  gear_image_uploaded?: string | null;

  gear_image_filesize?: number | null;

  gear_image_filesize_human?: string | null;

  timestamp_img?: string | null;

  gear_image_url?: string | null;

  needsUpload?: boolean | null;
}

export interface GearImageData {
  [key: string]: JsonValue | undefined;

  gear_id?: number | null;

  gear_image_type?: JsonValue | null;

  base64?: string | null;
}

export interface GearImages {
  [key: string]: JsonValue | undefined;

  image?: GearImage[] | null;

  file?: GearImage[] | null;
}

export interface GearSet {
  [key: string]: JsonValue | undefined;

  internalPk?: number | null;

  gearset_id?: number | null;

  gearset_mid?: number | null;

  gearset_name?: string | null;

  gearset_description?: string | null;

  gearset_created?: JsonValue | null;

  gearset_updated?: JsonValue | null;

  gearset_deleted?: boolean | null;

  gear?: number[] | null;

  needsUpload?: boolean | null;
}

export interface KnowledgeTable {
  [key: string]: JsonValue | undefined;

  id?: number | null;

  category?: string | null;

  program?: string | null;

  tx_key?: string | null;

  name_default?: string | null;

  thumb?: string | null;

  type?: string | null;

  content?: TableContent[] | null;
}

export interface NewEmailData {
  [key: string]: JsonValue | undefined;

  current_email?: string | null;

  current_pwd?: string | null;

  new_email?: string | null;

  user_id?: JsonValue | null;
}

export interface NewPasswordData {
  [key: string]: JsonValue | undefined;

  current_email?: string | null;

  current_pwd?: string | null;

  new_pwd?: string | null;

  user_id?: JsonValue | null;
}

export interface PressureRecord {
  [key: string]: JsonValue | undefined;

  t?: number | null;

  v?: number | null;
}

export interface PrivacySettingsData {
  [key: string]: JsonValue | undefined;

  user_id?: JsonValue | null;

  address?: JsonValue | null;

  allergies?: JsonValue | null;

  ccards?: JsonValue | null;

  emergency?: JsonValue | null;

  equipmentlist?: JsonValue | null;

  logbook?: JsonValue | null;

  sizingtable?: JsonValue | null;

  buddy_finder?: JsonValue | null;

  hide_recent_certs_online?: JsonValue | null;

  use_record_data?: JsonValue | null;

  marketing_consent?: JsonValue | null;
}

export interface ProfileImageData {
  [key: string]: JsonValue | undefined;

  base64?: string | null;
}

export interface Site {
  [key: string]: JsonValue | undefined;

  internalPk?: number | null;

  odin_dive_sites_id?: number | null;

  odin_dive_sites_name?: string | null;

  bow?: string | null;

  odin_user_log_animal_ids?: number[] | null;

  odin_dive_sites_lon?: number | null;

  odin_dive_sites_lat?: number | null;

  odin_dive_sites_meta_address?: string | null;

  odin_dive_sites_meta_region?: string | null;

  odin_dive_sites_meta_country?: string | null;

  odin_countries_code_iso?: string | null;

  odin_dive_sites_regions_name?: string | null;

  odin_dive_sites_areas_name?: string | null;

  odin_dive_sites_geo_locked?: boolean | null;

  odin_dive_sites_is_private?: boolean | null;

  odin_dive_sites_alias_ids?: string | null;

  odin_dive_sites_is_private_owner?: number | null;

  odin_dive_sites_deleted?: boolean | null;

  needsUpload?: boolean | null;

  alias_names_search?: string | null;

  alias_names?: string | null;
}

export interface SiteDescriptionData {
  [key: string]: JsonValue | undefined;

  iso3?: string | null;

  descr1?: string | null;

  descr2?: string | null;

  descr3?: string | null;

  odin_dive_sites_id?: number | null;
}

export interface SiteDetail {
  [key: string]: JsonValue | undefined;

  dive_site_id?: number | null;

  dive_site_name?: string | null;

  odin_dive_sites_lat?: number | null;

  odin_dive_sites_lon?: number | null;

  odin_dive_sites_is_private?: boolean | null;

  bow?: string | null;

  dives_logged_by_divers?: number | null;

  total_logged_dives?: number | null;

  logged_dives_user_avg?: number | null;

  avg_max_depth_logged?: number | null;

  avg_divetime_logged?: number | null;

  avg_log_rating?: number | null;

  avg_log_rating_dives?: number | null;

  avg_log_rating_details?: JsonString<JsonObject> | null;

  avg_log_rating_per_month?: JsonString<JsonObject> | null;

  avg_logged_dives_per_month?: string | null;

  temp_month_avg?: JsonString<JsonObject> | null;

  current?: JsonString<JsonObject> | null;

  diveType?: string | null;

  entryTypes?: string | null;

  odin_dive_sites_content?: string | null;

  odin_dive_sites_content_mapper?: string | null;

  sightings?: string | null;

  odin_user_log_animal_ids?: string | null;

  descr?: SiteDetailDescription[] | null;

  images?: SiteDetailImage[] | null;

  breadcrump_string?: string | null;
}

export interface SiteDetailDescription {
  [key: string]: JsonValue | undefined;

  descr_site_id?: number | null;

  descr_iso3?: string | null;

  descr_1?: string | null;

  descr_2?: string | null;

  descr_3?: string | null;

  descr_who?: string | null;

  descr_added_date?: string | null;
}

export interface SiteDetailImage {
  [key: string]: JsonValue | undefined;

  big?: string | null;

  thumb?: string | null;

  timestamp?: string | null;

  copyright?: string | null;
}

export interface SiteImageData {
  [key: string]: JsonValue | undefined;

  odin_dive_sites_id?: number | null;

  img_type?: string | null;

  terms_checked?: string | null;

  ofn?: string | null;

  base64?: string | null;
}

export interface SitesResponse {
  [key: string]: JsonValue | undefined;

  divesites?: Site[] | null;
}

export interface TableContent {
  [key: string]: JsonValue | undefined;

  iso3?: string | null;

  iso2?: string | null;

  language_title?: string | null;

  language_native?: string | null;

  name?: string | null;

  type?: string | null;

  file?: string | null;

  bytes?: number | null;
}

export interface TablesResponse {
  [key: string]: JsonValue | undefined;

  categories?: JsonValue | null;

  elements?: KnowledgeTable[] | null;
}

export interface User {
  [key: string]: JsonValue | undefined;

  authenticated?: boolean | null;

  user_email?: string | null;

  mid?: number | null;

  token?: string | null;

  user_language?: JsonValue | null;

  imperial?: boolean | null;

  user_id?: JsonValue | null;

  user_leader_nr?: JsonValue | null;

  user_facility_id?: JsonValue | null;

  user_title?: JsonValue | null;

  user_forename?: JsonValue | null;

  user_middlename?: JsonValue | null;

  user_lastname?: JsonValue | null;

  user_street?: JsonValue | null;

  user_street2?: JsonValue | null;

  user_zip?: JsonValue | null;

  user_city?: JsonValue | null;

  user_state?: JsonValue | null;

  user_country?: JsonValue | null;

  user_country_long?: JsonValue | null;

  user_mobile_c?: JsonValue | null;

  user_phone_c?: JsonValue | null;

  user_birthday?: string | null;

  user_gender?: string | null;

  user_status?: JsonValue | null;

  user_diving_since?: JsonValue | null;

  user_no_dives?: JsonValue | null;

  user_freediving_since?: JsonValue | null;

  user_no_freedives?: JsonValue | null;

  user_image?: string | null;

  user_units?: string | null;

  privacy_required?: boolean | null;

  privacy_settings_required?: boolean | null;

  privacy_settings?: JsonValue | null;

  apis?: JsonValue | null;

  my_divessi_url?: JsonValue | null;

  ems_apis?: JsonValue | null;

  pro?: JsonValue | null;

  needsUpload?: boolean | null;

  documents?: JsonValue | null;

  can_test_webview?: boolean | null;

  user_app_settings?: JsonValue | null;
}

export interface JsonFieldTypes {
  DiveLog: {
    odin_user_log_depthDataset: (number | null)[];

    odin_user_log_tempDataset: (number | null)[];

    odin_user_log_gfnowDataset: (number | null)[];

    odin_user_log_gfSurfDataset: (number | null)[];

    odin_user_log_deepestDecoDataset: (number | null)[];

    odin_user_log_tankPressureDataset: (number | null)[];

    odin_user_log_heartRateDataset: (number | null)[];

    odin_user_log_diveSamples: DiveRecord[];

    odin_user_log_alarmDataset: DiveAlarm[];

    odin_user_log_locationDataset: DiveLocationSample[];

    odin_user_log_freeDiveSessionCharts: FreeDiveSessionChart[];

    odin_user_log_housing_local_dive_media: JsonValue[];
  };
  FreeDiveSessionChart: {
    depth_set: (number | null)[];

    temp_set: (number | null)[];
  };
  SiteDetail: {
    current: JsonObject;

    temp_month_avg: JsonObject;

    avg_log_rating_per_month: JsonObject;

    avg_log_rating_details: JsonObject;
  };
}
