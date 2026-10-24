import type { JsonValue } from '../types.js';
import type {
  BuddiesResponse,
  Buddy,
  BuddyUploadResponse,
  CertificatesResponse,
  DiveCenter,
  DiveLog,
  DiveUploadResponse,
  DivelogResponse,
  EmergencyContact,
  Gear,
  GearImageData,
  GearSet,
  NewEmailData,
  NewPasswordData,
  PrivacySettingsData,
  ProfileImageData,
  Site,
  SiteDescriptionData,
  SiteImageData,
  SitesResponse,
  TablesResponse,
  User,
} from './models.js';

export type Identifier = string | number;

export type AchievementsInput = undefined;

export type BuddiesInput = undefined;

export interface BuddiesSearchInput {
  /** Search/filter text. */
  string: string;
}

export interface CentersInput {
  /** Latitude of the search/location origin. */
  lat: number;
  /** Longitude of the search/location origin. */
  lon: number;
}

export type CertificatesInput = undefined;

export type CountriesInput = undefined;

export type DivelogHistoryInput = undefined;

export type DivesInput = undefined;

export type GearInput = undefined;

export type GearSetsInput = undefined;

export interface LoginInput {
  /** Account login/email supplied to authentication. */
  l: string;
  /** Account password supplied to authentication. */
  p: string;
}

export type ProfileInput = undefined;

export interface SiteInput {
  /** Dive-site identifier. */
  dsid: Identifier;
}

export interface SiteDetailInput {
  /** Dive-site identifier. */
  site_id: Identifier;
}

export interface SitesInput {
  /** Incremental synchronization marker; timestamp unit is unspecified. */
  last_sync: number;
  /** Offset into the result listing. */
  offset?: number;
  /** Maximum number of requested listing results. */
  limit?: number;
}

export type TablesInput = undefined;

export interface BuddyUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: Buddy;
}

export interface DeleteGearInput {
  /** Equipment record identifier. */
  gear_id: Identifier;
}

export interface DeleteGearImageInput {
  /** Equipment record identifier. */
  gear_id: Identifier;
  /** Image record identifier. */
  image_id: Identifier;
}

export interface DiveUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: DiveLog;
}

export interface EmergencyContactUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: EmergencyContact;
}

export type EmergencyContactsInput = undefined;

export interface GearSetUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: GearSet;
}

export interface GearUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: Gear;
}

export interface PrivacySettingsUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: PrivacySettingsData;
}

export interface ProfileImageUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: ProfileImageData;
}

export interface ProfileUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: User;
}

export interface SaveGearImageInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: GearImageData;
}

export interface SaveUserDivecomputerInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: JsonValue;
}

export interface SiteDescriptionUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: SiteDescriptionData;
}

export interface SiteImageUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: SiteImageData;
}

export interface SiteUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: Site;
}

export interface UploadDivelogHistoryInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: JsonValue;
}

export interface NewEmailUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: NewEmailData;
}

export interface NewPasswordUploadInput {
  /** Structured request data. The client encodes this outer value once; JSON-text fields inside it still use their own string encoding. */
  json_data: NewPasswordData;
}

export type AchievementsOutput = JsonValue;

export type BuddiesOutput = BuddiesResponse;

export type BuddiesSearchOutput = JsonValue;

export type CentersOutput = DiveCenter[];

export type CertificatesOutput = CertificatesResponse;

export type CountriesOutput = JsonValue;

export type DivelogHistoryOutput = JsonValue;

export type DivesOutput = DivelogResponse;

export type GearOutput = Gear[];

export type GearSetsOutput = GearSet[];

export type LoginOutput = User;

export type ProfileOutput = User;

export type SiteOutput = JsonValue;

export type SiteDetailOutput = JsonValue;

export type SitesOutput = SitesResponse;

export type TablesOutput = TablesResponse;

export type BuddyUploadOutput = BuddyUploadResponse;

export type DeleteGearOutput = JsonValue;

export type DeleteGearImageOutput = JsonValue;

export type DiveUploadOutput = DiveUploadResponse;

export type EmergencyContactUploadOutput = JsonValue;

export type EmergencyContactsOutput = JsonValue;

export type GearSetUploadOutput = JsonValue;

export type GearUploadOutput = JsonValue;

export type PrivacySettingsUploadOutput = JsonValue;

export type ProfileImageUploadOutput = JsonValue;

export type ProfileUploadOutput = JsonValue;

export type SaveGearImageOutput = JsonValue;

export type SaveUserDivecomputerOutput = JsonValue;

export type SiteDescriptionUploadOutput = JsonValue;

export type SiteImageUploadOutput = JsonValue;

export type SiteUploadOutput = JsonValue;

export type UploadDivelogHistoryOutput = JsonValue;

export type NewEmailUploadOutput = JsonValue;

export type NewPasswordUploadOutput = JsonValue;

export interface OperationInputs {
  achievements: AchievementsInput;
  buddies: BuddiesInput;
  buddiesSearch: BuddiesSearchInput;
  centers: CentersInput;
  certificates: CertificatesInput;
  countries: CountriesInput;
  divelogHistory: DivelogHistoryInput;
  dives: DivesInput;
  gear: GearInput;
  gearSets: GearSetsInput;
  login: LoginInput;
  profile: ProfileInput;
  site: SiteInput;
  siteDetail: SiteDetailInput;
  sites: SitesInput;
  tables: TablesInput;
  buddyUpload: BuddyUploadInput;
  deleteGear: DeleteGearInput;
  deleteGearImage: DeleteGearImageInput;
  diveUpload: DiveUploadInput;
  emergencyContactUpload: EmergencyContactUploadInput;
  emergencyContacts: EmergencyContactsInput;
  gearSetUpload: GearSetUploadInput;
  gearUpload: GearUploadInput;
  privacySettingsUpload: PrivacySettingsUploadInput;
  profileImageUpload: ProfileImageUploadInput;
  profileUpload: ProfileUploadInput;
  saveGearImage: SaveGearImageInput;
  saveUserDivecomputer: SaveUserDivecomputerInput;
  siteDescriptionUpload: SiteDescriptionUploadInput;
  siteImageUpload: SiteImageUploadInput;
  siteUpload: SiteUploadInput;
  uploadDivelogHistory: UploadDivelogHistoryInput;
  newEmailUpload: NewEmailUploadInput;
  newPasswordUpload: NewPasswordUploadInput;
}

export interface OperationOutputs {
  achievements: AchievementsOutput;
  buddies: BuddiesOutput;
  buddiesSearch: BuddiesSearchOutput;
  centers: CentersOutput;
  certificates: CertificatesOutput;
  countries: CountriesOutput;
  divelogHistory: DivelogHistoryOutput;
  dives: DivesOutput;
  gear: GearOutput;
  gearSets: GearSetsOutput;
  login: LoginOutput;
  profile: ProfileOutput;
  site: SiteOutput;
  siteDetail: SiteDetailOutput;
  sites: SitesOutput;
  tables: TablesOutput;
  buddyUpload: BuddyUploadOutput;
  deleteGear: DeleteGearOutput;
  deleteGearImage: DeleteGearImageOutput;
  diveUpload: DiveUploadOutput;
  emergencyContactUpload: EmergencyContactUploadOutput;
  emergencyContacts: EmergencyContactsOutput;
  gearSetUpload: GearSetUploadOutput;
  gearUpload: GearUploadOutput;
  privacySettingsUpload: PrivacySettingsUploadOutput;
  profileImageUpload: ProfileImageUploadOutput;
  profileUpload: ProfileUploadOutput;
  saveGearImage: SaveGearImageOutput;
  saveUserDivecomputer: SaveUserDivecomputerOutput;
  siteDescriptionUpload: SiteDescriptionUploadOutput;
  siteImageUpload: SiteImageUploadOutput;
  siteUpload: SiteUploadOutput;
  uploadDivelogHistory: UploadDivelogHistoryOutput;
  newEmailUpload: NewEmailUploadOutput;
  newPasswordUpload: NewPasswordUploadOutput;
}
