Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip,
} = require("@prisma/client/runtime/index-browser.js");

const Prisma = {};

exports.Prisma = Prisma;
exports.$Enums = {};

/**
 * Prisma Client JS version: 5.21.1
 * Query Engine version: bf0e5e8a04cada8225617067eaa03d041e2bba36
 */
Prisma.prismaVersion = {
  client: "5.21.1",
  engine: "bf0e5e8a04cada8225617067eaa03d041e2bba36",
};

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;

/**
 * Extensions
 */
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull,
};

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable",
});

exports.Prisma.Auth_groupScalarFieldEnum = {
  id: "id",
  name: "name",
};

exports.Prisma.Auth_group_permissionsScalarFieldEnum = {
  id: "id",
  group_id: "group_id",
  permission_id: "permission_id",
};

exports.Prisma.Auth_permissionScalarFieldEnum = {
  id: "id",
  name: "name",
  content_type_id: "content_type_id",
  codename: "codename",
};

exports.Prisma.Auth_userScalarFieldEnum = {
  id: "id",
  password: "password",
  last_login: "last_login",
  is_superuser: "is_superuser",
  username: "username",
  first_name: "first_name",
  last_name: "last_name",
  email: "email",
  is_staff: "is_staff",
  is_active: "is_active",
  date_joined: "date_joined",
};

exports.Prisma.Auth_user_groupsScalarFieldEnum = {
  id: "id",
  user_id: "user_id",
  group_id: "group_id",
};

exports.Prisma.Auth_user_user_permissionsScalarFieldEnum = {
  id: "id",
  user_id: "user_id",
  permission_id: "permission_id",
};

exports.Prisma.Django_admin_logScalarFieldEnum = {
  id: "id",
  action_time: "action_time",
  object_id: "object_id",
  object_repr: "object_repr",
  action_flag: "action_flag",
  change_message: "change_message",
  content_type_id: "content_type_id",
  user_id: "user_id",
};

exports.Prisma.Django_content_typeScalarFieldEnum = {
  id: "id",
  app_label: "app_label",
  model: "model",
};

exports.Prisma.Django_migrationsScalarFieldEnum = {
  id: "id",
  app: "app",
  name: "name",
  applied: "applied",
};

exports.Prisma.Django_sessionScalarFieldEnum = {
  session_key: "session_key",
  session_data: "session_data",
  expire_date: "expire_date",
};

exports.Prisma.Integrations_logsScalarFieldEnum = {
  id: "id",
  type: "type",
  created_at: "created_at",
  status: "status",
  error: "error",
  data: "data",
  integration: "integration",
  external_id: "external_id",
  form_type: "form_type",
  internal_id: "internal_id",
};

exports.Prisma.VolunteersScalarFieldEnum = {
  id: "id",
  created_at: "created_at",
  updated_at: "updated_at",
  condition: "condition",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  phone: "phone",
  zipcode: "zipcode",
  state: "state",
  city: "city",
  neighborhood: "neighborhood",
  latitude: "latitude",
  longitude: "longitude",
  registrationNumber: "registrationNumber",
  birth_date: "birth_date",
  color: "color",
  gender: "gender",
  modality: "modality",
  fields_of_work: "fields_of_work",
  years_of_experience: "years_of_experience",
  approach: "approach",
  form_data_id: "form_data_id",
  occupation: "occupation",
  moodle_id: "moodle_id",
  form_entries_id: "form_entries_id",
  zendeskUserId: "zendeskUserId",
  availability: "availability",
  offers_libras_support: "offers_libras_support",
  street: "street",
};

exports.Prisma.Volunteers_formdataScalarFieldEnum = {
  id: "id",
  type_form: "type_form",
  step: "step",
  values: "values",
  user_id: "user_id",
  created_at: "created_at",
  total_steps: "total_steps",
  updated_at: "updated_at",
};

exports.Prisma.MSRsScalarFieldEnum = {
  msrId: "msrId",
  gender: "gender",
  raceColor: "raceColor",
  hasDisability: "hasDisability",
  acceptsOnlineSupport: "acceptsOnlineSupport",
  zipcode: "zipcode",
  neighborhood: "neighborhood",
  city: "city",
  state: "state",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.MSRPiiSecScalarFieldEnum = {
  msrId: "msrId",
  firstName: "firstName",
  email: "email",
  phone: "phone",
  dateOfBirth: "dateOfBirth",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.MSRStatusHistoryScalarFieldEnum = {
  msrStatusHistoryId: "msrStatusHistoryId",
  msrId: "msrId",
  status: "status",
  createdAt: "createdAt",
};

exports.Prisma.MSRViolenceHistoryScalarFieldEnum = {
  msrViolenceHistoryId: "msrViolenceHistoryId",
  msrId: "msrId",
  violenceType: "violenceType",
  violenceTime: "violenceTime",
  violenceOccurredInBrazil: "violenceOccurredInBrazil",
  perpetratorGender: "perpetratorGender",
  violencePerpetrator: "violencePerpetrator",
  livesWithPerpetrator: "livesWithPerpetrator",
  violenceLocation: "violenceLocation",
  legalActionsTaken: "legalActionsTaken",
  legalActionDifficulty: "legalActionDifficulty",
  protectiveFactors: "protectiveFactors",
  riskFactors: "riskFactors",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.MSRSocioeconomicDataScalarFieldEnum = {
  msrSocioeconomicId: "msrSocioeconomicId",
  msrId: "msrId",
  hasMonthlyIncome: "hasMonthlyIncome",
  monthlyIncomeRange: "monthlyIncomeRange",
  employmentStatus: "employmentStatus",
  hasFinancialDependents: "hasFinancialDependents",
  familyProvider: "familyProvider",
  propertyOwnership: "propertyOwnership",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.SupportRequestsScalarFieldEnum = {
  supportRequestId: "supportRequestId",
  msrId: "msrId",
  zendeskTicketId: "zendeskTicketId",
  supportType: "supportType",
  supportExpertise: "supportExpertise",
  priority: "priority",
  hasDisability: "hasDisability",
  requiresLibras: "requiresLibras",
  acceptsOnlineSupport: "acceptsOnlineSupport",
  lat: "lat",
  lng: "lng",
  city: "city",
  state: "state",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.SupportRequestStatusHistoryScalarFieldEnum = {
  supportRequestStatusHistoryId: "supportRequestStatusHistoryId",
  supportRequestId: "supportRequestId",
  status: "status",
  createdAt: "createdAt",
};

exports.Prisma.MatchesScalarFieldEnum = {
  matchId: "matchId",
  supportRequestId: "supportRequestId",
  msrId: "msrId",
  volunteerId: "volunteerId",
  msrZendeskTicketId: "msrZendeskTicketId",
  volunteerZendeskTicketId: "volunteerZendeskTicketId",
  supportType: "supportType",
  matchType: "matchType",
  matchStage: "matchStage",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.MatchConfirmationsScalarFieldEnum = {
  matchConfirmationId: "matchConfirmationId",
  supportRequestId: "supportRequestId",
  msrId: "msrId",
  volunteerId: "volunteerId",
  status: "status",
  matchType: "matchType",
  matchStage: "matchStage",
  matchId: "matchId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.MatchConfirmationStatusHistoryScalarFieldEnum = {
  matchConfirmationStatusHistoryId: "matchConfirmationStatusHistoryId",
  matchConfirmationId: "matchConfirmationId",
  status: "status",
  createdAt: "createdAt",
};

exports.Prisma.MatchStatusHistoryScalarFieldEnum = {
  matchStatusHistoryId: "matchStatusHistoryId",
  matchId: "matchId",
  status: "status",
  createdAt: "createdAt",
};

exports.Prisma.MatchSurveysScalarFieldEnum = {
  matchSurveyId: "matchSurveyId",
  matchId: "matchId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  surveyType: "surveyType",
};

exports.Prisma.CitiesScalarFieldEnum = {
  city_id: "city_id",
  city_value: "city_value",
  city_label: "city_label",
  state: "state",
  ibge_code: "ibge_code",
  created_at: "created_at",
  updated_at: "updated_at",
};

exports.Prisma.VolunteerAvailabilityScalarFieldEnum = {
  volunteer_id: "volunteer_id",
  current_matches: "current_matches",
  max_matches: "max_matches",
  is_available: "is_available",
  support_type: "support_type",
  support_expertise: "support_expertise",
  offers_online_support: "offers_online_support",
  lat: "lat",
  lng: "lng",
  city: "city",
  created_at: "created_at",
  updated_at: "updated_at",
  state: "state",
  offers_libras_support: "offers_libras_support",
};

exports.Prisma.VolunteerStatusHistoryScalarFieldEnum = {
  id: "id",
  created_at: "created_at",
  volunteer_id: "volunteer_id",
  status: "status",
};

exports.Prisma.VolunteerSegmentsScalarFieldEnum = {
  volunteer_segment_id: "volunteer_segment_id",
  segment_name: "segment_name",
  volunteer_id: "volunteer_id",
  volunteer_segment_group: "volunteer_segment_group",
  created_at: "created_at",
  updatedAt: "updatedAt",
};

exports.Prisma.VolunteerUnsubscriptionsScalarFieldEnum = {
  volunteer_unsubscription_id: "volunteer_unsubscription_id",
  volunteer_id: "volunteer_id",
  unsubscription_reason: "unsubscription_reason",
  unsubscription_description: "unsubscription_description",
  created_at: "created_at",
  updated_at: "updated_at",
};

exports.Prisma.VolunteerTrainingHistoryScalarFieldEnum = {
  volunteer_training_history_id: "volunteer_training_history_id",
  volunteer_id: "volunteer_id",
  moodle_user_id: "moodle_user_id",
  event: "event",
  created_at: "created_at",
};

exports.Prisma.FeatureFlagScalarFieldEnum = {
  id: "id",
  featureEnabled: "featureEnabled",
  featureName: "featureName",
};

exports.Prisma.BusaraHashesScalarFieldEnum = {
  msrEmail: "msrEmail",
  hash: "hash",
};

exports.Prisma.MutipliersScalarFieldEnum = {
  multiplierId: "multiplierId",
  gender: "gender",
  age: "age",
  region: "region",
  state: "state",
  city: "city",
  householdType: "householdType",
  hasChildren: "hasChildren",
  howManyChildren: "howManyChildren",
  race: "race",
  sexuality: "sexuality",
  religion: "religion",
  hasDisability: "hasDisability",
  disabilityType: "disabilityType",
  hasInternetAccess: "hasInternetAccess",
  isAvailable: "isAvailable",
  shiftAvailability: "shiftAvailability",
  educationLevel: "educationLevel",
  isUniversityStudent: "isUniversityStudent",
  universityType: "universityType",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.MutiplierPiiScalarFieldEnum = {
  multiplierPiiId: "multiplierPiiId",
  multiplierId: "multiplierId",
  email: "email",
  firstName: "firstName",
  lastName: "lastName",
  phone: "phone",
  zip_code: "zip_code",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.MultiplierRegistrationOpenQuestionsScalarFieldEnum = {
  multiplier_registration_open_questions_id:
    "multiplier_registration_open_questions_id",
  multiplierId: "multiplierId",
  universityName: "universityName",
  universityCourse: "universityCourse",
  howSheHeardAboutUs: "howSheHeardAboutUs",
  reasonsForParticipating: "reasonsForParticipating",
};

exports.Prisma.MultiplierJourneyEventsScalarFieldEnum = {
  multiplierJourneyEventId: "multiplierJourneyEventId",
  multiplierId: "multiplierId",
  event: "event",
  createdAt: "createdAt",
};

exports.Prisma.PublicServicesScalarFieldEnum = {
  publicServiceId: "publicServiceId",
  serviceType: "serviceType",
  serviceName: "serviceName",
  zipcode: "zipcode",
  address: "address",
  phone: "phone",
  email: "email",
  region: "region",
  state: "state",
  city: "city",
  lat: "lat",
  lng: "lng",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.BusaraABExperimentScalarFieldEnum = {
  BusaraABExperimenId: "BusaraABExperimenId",
  matchId: "matchId",
  supportRequestId: "supportRequestId",
  msrId: "msrId",
  transactionalId: "transactionalId",
};

exports.Prisma.SurveyQualityOfLifeD0ScalarFieldEnum = {
  answerId: "answerId",
  msrId: "msrId",
  qualityOfLife: "qualityOfLife",
  security: "security",
  controllingSituations: "controllingSituations",
  selfEsteem: "selfEsteem",
  feelings: "feelings",
  physicalSymptoms: "physicalSymptoms",
  emotionalSymptoms: "emotionalSymptoms",
  handleViolenceImpact: "handleViolenceImpact",
  createdAt: "createdAt",
};

exports.Prisma.SurveyQualityOfLifeD90ScalarFieldEnum = {
  answerId: "answerId",
  msrId: "msrId",
  qualityOfLife: "qualityOfLife",
  security: "security",
  controllingSituations: "controllingSituations",
  selfEsteem: "selfEsteem",
  feelings: "feelings",
  physicalSymptoms: "physicalSymptoms",
  emotionalSymptoms: "emotionalSymptoms",
  handleViolenceImpact: "handleViolenceImpact",
  createdAt: "createdAt",
};

exports.Prisma.SurveyQualityOfLifeD180ScalarFieldEnum = {
  answerId: "answerId",
  msrId: "msrId",
  qualityOfLife: "qualityOfLife",
  security: "security",
  controllingSituations: "controllingSituations",
  selfEsteem: "selfEsteem",
  feelings: "feelings",
  physicalSymptoms: "physicalSymptoms",
  emotionalSymptoms: "emotionalSymptoms",
  handleViolenceImpact: "handleViolenceImpact",
  substanceUse: "substanceUse",
  createdAt: "createdAt",
};

exports.Prisma.SurveyQualityOfLifeD270ScalarFieldEnum = {
  answerId: "answerId",
  msrId: "msrId",
  qualityOfLife: "qualityOfLife",
  security: "security",
  controllingSituations: "controllingSituations",
  selfEsteem: "selfEsteem",
  physicalSymptoms: "physicalSymptoms",
  emotionalSymptoms: "emotionalSymptoms",
  handleViolenceImpact: "handleViolenceImpact",
  createdAt: "createdAt",
};

exports.Prisma.PsychologicalSupportEvaluationScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  hadToPayForSupport: "hadToPayForSupport",
  isStrategyUseful: "isStrategyUseful",
  handleStressAnxiety: "handleStressAnxiety",
  satisfactionLevel: "satisfactionLevel",
  agreementsFulfilled: "agreementsFulfilled",
  expectationsMet: "expectationsMet",
  isReceivingService: "isReceivingService",
  writtenEvaluation: "writtenEvaluation",
  createdAt: "createdAt",
};

exports.Prisma.LegalSupportEvaluationScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  hadToPayForSupport: "hadToPayForSupport",
  hasReceivedClearInformation: "hasReceivedClearInformation",
  handleStressAnxiety: "handleStressAnxiety",
  caseProgress: "caseProgress",
  satisfactionLevel: "satisfactionLevel",
  agreementsFulfilled: "agreementsFulfilled",
  isReceivingService: "isReceivingService",
  expectationsMet: "expectationsMet",
  writtenEvaluation: "writtenEvaluation",
  createdAt: "createdAt",
};

exports.Prisma.MsrPsychologicalSupportConclusionScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  isStrategyUseful: "isStrategyUseful",
  handleStressAnxiety: "handleStressAnxiety",
  satisfactionLevel: "satisfactionLevel",
  continueWithVolunteer: "continueWithVolunteer",
  experienceFeedback: "experienceFeedback",
  neededPublicServices: "neededPublicServices",
  informedAboutServices: "informedAboutServices",
  improvementSuggestions: "improvementSuggestions",
  createdAt: "createdAt",
};

exports.Prisma.MsrLegalSupportConclusionScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  informedAboutCase: "informedAboutCase",
  handleStressAnxiety: "handleStressAnxiety",
  satisfactionLevel: "satisfactionLevel",
  continueWithVolunteer: "continueWithVolunteer",
  experienceFeedback: "experienceFeedback",
  neededPublicServices: "neededPublicServices",
  informedAboutServices: "informedAboutServices",
  improvementSuggestions: "improvementSuggestions",
  createdAt: "createdAt",
};

exports.Prisma.LegalSupportFollowUpIScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  disabilityType: "disabilityType",
  supportStartDate: "supportStartDate",
  hasProBonoContract: "hasProBonoContract",
  weeklyHours: "weeklyHours",
  contractFormat: "contractFormat",
  safeContactMethods: "safeContactMethods",
  violenceAwareness: "violenceAwareness",
  violenceTypes: "violenceTypes",
  behavioralImpacts: "behavioralImpacts",
  relationshipImpacts: "relationshipImpacts",
  socioeconomicImpacts: "socioeconomicImpacts",
  securityImpacts: "securityImpacts",
  violenceAssessment: "violenceAssessment",
  mainDemandCategory: "mainDemandCategory",
  mainDemandSubcategory: "mainDemandSubcategory",
  caseConductionDetails: "caseConductionDetails",
  proBonoInCaseFiles: "proBonoInCaseFiles",
  safetyPlanUsed: "safetyPlanUsed",
  safetyPlanDescription: "safetyPlanDescription",
  violenceProcessImpacts: "violenceProcessImpacts",
  psychologicalDocumentUsed: "psychologicalDocumentUsed",
  legalChallengesExist: "legalChallengesExist",
  legalChallenges: "legalChallenges",
  publicServiceReferral: "publicServiceReferral",
  publicServiceReferralReason: "publicServiceReferralReason",
  publicServicesArticulated: "publicServicesArticulated",
  psychologistContact: "psychologistContact",
  psychologistCollaboration: "psychologistCollaboration",
  suicideRiskConcern: "suicideRiskConcern",
  genderProceduralAbuse: "genderProceduralAbuse",
  genderProceduralAbuseReport: "genderProceduralAbuseReport",
  teamResponseToReport: "teamResponseToReport",
  volunteerFeelings: "volunteerFeelings",
  needTechnicalSupportLast45d: "needTechnicalSupportLast45d",
  technicalSupportHelp: "technicalSupportHelp",
  stillNeedHelp: "stillNeedHelp",
  supportSatisfaction: "supportSatisfaction",
  suggestions: "suggestions",
  createdAt: "createdAt",
};

exports.Prisma.LegalSupportFollowUpIIScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  stillInSupport: "stillInSupport",
  weeklyHours: "weeklyHours",
  respectsAgreements: "respectsAgreements",
  extraContactFrequency: "extraContactFrequency",
  agreementIssuesDescription: "agreementIssuesDescription",
  violenceAwareness: "violenceAwareness",
  newViolenceSinceLastForm: "newViolenceSinceLastForm",
  newViolenceTypes: "newViolenceTypes",
  behavioralImpacts: "behavioralImpacts",
  relationshipImpacts: "relationshipImpacts",
  socioeconomicImpacts: "socioeconomicImpacts",
  securityImpacts: "securityImpacts",
  violenceAssessment: "violenceAssessment",
  mainDemandCategory: "mainDemandCategory",
  mainDemandDescription: "mainDemandDescription",
  legalProcessStageCriminal: "legalProcessStageCriminal",
  legalProcessStageCivil: "legalProcessStageCivil",
  safetyPlanUsed: "safetyPlanUsed",
  safetyPlanDescription: "safetyPlanDescription",
  violenceProcessImpacts: "violenceProcessImpacts",
  caseConductionDetails: "caseConductionDetails",
  latestCaseUpdate: "latestCaseUpdate",
  proBonoInCaseFiles: "proBonoInCaseFiles",
  psychologicalDocumentUsed: "psychologicalDocumentUsed",
  legalChallengesExist: "legalChallengesExist",
  legalChallenges: "legalChallenges",
  publicServiceReferralReason: "publicServiceReferralReason",
  publicServicesArticulated: "publicServicesArticulated",
  psychologistContact: "psychologistContact",
  psychologistCollaboration: "psychologistCollaboration",
  suicideRiskConcern: "suicideRiskConcern",
  genderProceduralAbuse: "genderProceduralAbuse",
  genderProceduralAbuseReport: "genderProceduralAbuseReport",
  teamResponseToReport: "teamResponseToReport",
  volunteerFeelings: "volunteerFeelings",
  requestedTechnicalSupport90d: "requestedTechnicalSupport90d",
  technicalSupportHelp: "technicalSupportHelp",
  stillNeedHelp: "stillNeedHelp",
  suggestions: "suggestions",
  createdAt: "createdAt",
};

exports.Prisma.VolunteerLegalSupportConclusionScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  supportEndDate: "supportEndDate",
  weeklyHours: "weeklyHours",
  respectsAgreements: "respectsAgreements",
  proBonoInCaseFiles: "proBonoInCaseFiles",
  violenceAwareness: "violenceAwareness",
  violenceTypes: "violenceTypes",
  behavioralImpacts: "behavioralImpacts",
  relationshipImpacts: "relationshipImpacts",
  socioeconomicImpacts: "socioeconomicImpacts",
  securityImpacts: "securityImpacts",
  violenceAssessment: "violenceAssessment",
  mainDemandCategory: "mainDemandCategory",
  mainDemandDescription: "mainDemandDescription",
  safetyPlanUsed: "safetyPlanUsed",
  jurisdiction: "jurisdiction",
  usedGenderPrecedents: "usedGenderPrecedents",
  usedHumanRightsArguments: "usedHumanRightsArguments",
  psychologicalDocumentUsed: "psychologicalDocumentUsed",
  caseConductionDetails: "caseConductionDetails",
  violenceProcessImpacts: "violenceProcessImpacts",
  legalChallenges: "legalChallenges",
  expectedOutcomeAchieved: "expectedOutcomeAchieved",
  publicServiceReferralReason: "publicServiceReferralReason",
  publicServicesArticulated: "publicServicesArticulated",
  psychologistContact: "psychologistContact",
  psychologistCollaboration: "psychologistCollaboration",
  psychologistCollaborationLearnings: "psychologistCollaborationLearnings",
  genderProceduralAbuse: "genderProceduralAbuse",
  genderProceduralAbuseReport: "genderProceduralAbuseReport",
  teamResponseToReport: "teamResponseToReport",
  lessonsLearned: "lessonsLearned",
  challengesFaced: "challengesFaced",
  volunteerFeelings: "volunteerFeelings",
  requestedTechnicalSupport: "requestedTechnicalSupport",
  technicalSupportHelp: "technicalSupportHelp",
  supportSatisfaction: "supportSatisfaction",
  messageToTeam: "messageToTeam",
  suggestions: "suggestions",
  createdAt: "createdAt",
};

exports.Prisma.PsychologicalSupportFollowUpIScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  disabilityType: "disabilityType",
  supportStartDate: "supportStartDate",
  hasProBonoContract: "hasProBonoContract",
  hasAbsencePolicy: "hasAbsencePolicy",
  contractFormat: "contractFormat",
  safeContactMethods: "safeContactMethods",
  violenceAwareness: "violenceAwareness",
  violenceTypes: "violenceTypes",
  behavioralImpacts: "behavioralImpacts",
  relationshipImpacts: "relationshipImpacts",
  socioeconomicImpacts: "socioeconomicImpacts",
  securityImpacts: "securityImpacts",
  violenceAssessment: "violenceAssessment",
  mainDemand: "mainDemand",
  caseConductionDetails: "caseConductionDetails",
  safetyPlanUsed: "safetyPlanUsed",
  safetyPlanDescription: "safetyPlanDescription",
  clinicalDifficultiesExist: "clinicalDifficultiesExist",
  clinicalDifficulties: "clinicalDifficulties",
  bondingStrategies: "bondingStrategies",
  caseReferrals: "caseReferrals",
  publicServiceReferralReason: "publicServiceReferralReason",
  publicServicesArticulated: "publicServicesArticulated",
  lawyerContact: "lawyerContact",
  lawyerCollaboration: "lawyerCollaboration",
  suicideRiskConcern: "suicideRiskConcern",
  hasPsychiatricSupport: "hasPsychiatricSupport",
  volunteerFeelings: "volunteerFeelings",
  needTechnicalSupportLast45d: "needTechnicalSupportLast45d",
  technicalSupportHelp: "technicalSupportHelp",
  stillNeedHelp: "stillNeedHelp",
  supportSatisfaction: "supportSatisfaction",
  suggestions: "suggestions",
  createdAt: "createdAt",
};

exports.Prisma.PsychologicalSupportFollowUpIIScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  stillInSupport: "stillInSupport",
  isAttendanceRegular: "isAttendanceRegular",
  irregularAttendanceReason: "irregularAttendanceReason",
  respectsAgreements: "respectsAgreements",
  extraContactFrequency: "extraContactFrequency",
  agreementIssuesDescription: "agreementIssuesDescription",
  violenceAwareness: "violenceAwareness",
  newViolenceSinceLastForm: "newViolenceSinceLastForm",
  behavioralImpacts: "behavioralImpacts",
  relationshipImpacts: "relationshipImpacts",
  socioeconomicImpacts: "socioeconomicImpacts",
  securityImpacts: "securityImpacts",
  violenceAssessment: "violenceAssessment",
  mainDemand: "mainDemand",
  caseConductionDetails: "caseConductionDetails",
  safetyPlanUsed: "safetyPlanUsed",
  safetyPlanDescription: "safetyPlanDescription",
  clinicalDifficultiesExist: "clinicalDifficultiesExist",
  clinicalDifficulties: "clinicalDifficulties",
  newBondingStrategies: "newBondingStrategies",
  newBondingStrategiesDescription: "newBondingStrategiesDescription",
  publicServiceReferralReason: "publicServiceReferralReason",
  publicServicesArticulated: "publicServicesArticulated",
  lawyerContact: "lawyerContact",
  lawyerCollaboration: "lawyerCollaboration",
  suicideRiskConcern: "suicideRiskConcern",
  hasPsychiatricSupport: "hasPsychiatricSupport",
  experiencedGenderViolence: "experiencedGenderViolence",
  reportedGenderViolence: "reportedGenderViolence",
  teamResponseToReport: "teamResponseToReport",
  volunteerFeelings: "volunteerFeelings",
  requestedTechnicalSupport90d: "requestedTechnicalSupport90d",
  technicalSupportHelp: "technicalSupportHelp",
  stillNeedHelp: "stillNeedHelp",
  supportSatisfaction: "supportSatisfaction",
  suggestions: "suggestions",
  createdAt: "createdAt",
};

exports.Prisma.VolunteerPsychologicalSupportConclusionScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  supportEndDate: "supportEndDate",
  supportOutsideOrg: "supportOutsideOrg",
  violenceAwareness: "violenceAwareness",
  violenceTypes: "violenceTypes",
  behavioralImpacts: "behavioralImpacts",
  relationshipImpacts: "relationshipImpacts",
  socioeconomicImpacts: "socioeconomicImpacts",
  securityImpacts: "securityImpacts",
  violenceAssessment: "violenceAssessment",
  psychologicalOutcomes: "psychologicalOutcomes",
  safetyPlanUsed: "safetyPlanUsed",
  processOutcomeDescription: "processOutcomeDescription",
  clinicalDifficulties: "clinicalDifficulties",
  bondingStrategies: "bondingStrategies",
  skillsAcquired: "skillsAcquired",
  publicServiceReferralReason: "publicServiceReferralReason",
  publicServicesArticulated: "publicServicesArticulated",
  lawyerContact: "lawyerContact",
  lawyerCollaboration: "lawyerCollaboration",
  lawyerCollaborationLearnings: "lawyerCollaborationLearnings",
  experiencedGenderViolence: "experiencedGenderViolence",
  reportedGenderViolence: "reportedGenderViolence",
  teamResponseToReport: "teamResponseToReport",
  lessonsLearned: "lessonsLearned",
  challengesFaced: "challengesFaced",
  volunteerFeelings: "volunteerFeelings",
  requestedTechnicalSupport: "requestedTechnicalSupport",
  technicalSupportHelp: "technicalSupportHelp",
  supportSatisfaction: "supportSatisfaction",
  messageToTeam: "messageToTeam",
  suggestions: "suggestions",
  createdAt: "createdAt",
};

exports.Prisma.SupportInterruptionScalarFieldEnum = {
  answerId: "answerId",
  matchId: "matchId",
  hasDifferentDemandInfo: "hasDifferentDemandInfo",
  differentDemandDescription: "differentDemandDescription",
  interruptionReason: "interruptionReason",
  redirectAreaNeeded: "redirectAreaNeeded",
  publicServicesReferral: "publicServicesReferral",
  stayInProject: "stayInProject",
  exitOrSuspend: "exitOrSuspend",
  suspensionCategory: "suspensionCategory",
  suspensionReason: "suspensionReason",
  createdAt: "createdAt",
};

exports.Prisma.MsrInstrumentalRecordScalarFieldEnum = {
  msrInstrumentalRecordId: "msrInstrumentalRecordId",
  matchId: "matchId",
  msrId: "msrId",
  instrumentalType: "instrumentalType",
  status: "status",
  answerId: "answerId",
  sentAt: "sentAt",
  answeredAt: "answeredAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.VolunteerInstrumentalRecordScalarFieldEnum = {
  volunteerInstrumentalRecordId: "volunteerInstrumentalRecordId",
  matchId: "matchId",
  volunteerId: "volunteerId",
  instrumentalType: "instrumentalType",
  status: "status",
  answerId: "answerId",
  sentAt: "sentAt",
  answeredAt: "answeredAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.MdaFormsAnswersScalarFieldEnum = {
  id: "id",
  form: "form",
  formId: "formId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  organizationId: "organizationId",
  volunteerEmail: "volunteerEmail",
  msrName: "msrName",
  ticketId: "ticketId",
  answers: "answers",
};

exports.Prisma.Iana_feedbackScalarFieldEnum = {
  id: "id",
  created_at: "created_at",
  user_id: "user_id",
  question: "question",
  answer: "answer",
};

exports.Prisma.SortOrder = {
  asc: "asc",
  desc: "desc",
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull,
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
};

exports.Prisma.QueryMode = {
  default: "default",
  insensitive: "insensitive",
};

exports.Prisma.NullsOrder = {
  first: "first",
  last: "last",
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull,
};
exports.Gender = exports.$Enums.Gender = {
  cis_woman: "cis_woman",
  trans_woman: "trans_woman",
  not_found: "not_found",
};

exports.Race = exports.$Enums.Race = {
  black: "black",
  brown: "brown",
  indigenous: "indigenous",
  yellow: "yellow",
  white: "white",
  prefer_not_to_answer: "prefer_not_to_answer",
  not_found: "not_found",
};

exports.MSRStatus = exports.$Enums.MSRStatus = {
  registered: "registered",
  unregistered: "unregistered",
  registered_by_public_service: "registered_by_public_service",
};

exports.ViolenceTime = exports.$Enums.ViolenceTime = {
  last_week: "last_week",
  less_than_3_months: "less_than_3_months",
  between_3_months_and_1_year: "between_3_months_and_1_year",
  between_1_and_3_years: "between_1_and_3_years",
  between_3_and_6_years: "between_3_and_6_years",
  between_6_and_10_years: "between_6_and_10_years",
  more_than_10_years: "more_than_10_years",
};

exports.PerpetratorGender = exports.$Enums.PerpetratorGender = {
  woman: "woman",
  man: "man",
  non_binary: "non_binary",
};

exports.LivesWithPerpetrator = exports.$Enums.LivesWithPerpetrator = {
  yes: "yes",
  no: "no",
  never: "never",
};

exports.ViolenceType = exports.$Enums.ViolenceType = {
  physical_violence: "physical_violence",
  psychological_violence: "psychological_violence",
  sexual_violence: "sexual_violence",
  moral_violence: "moral_violence",
  digital_violence: "digital_violence",
  patrimonial_violence: "patrimonial_violence",
  obstetric_violence: "obstetric_violence",
  threat: "threat",
  political_violence: "political_violence",
  no_violence: "no_violence",
};

exports.ViolencePerpetrator = exports.$Enums.ViolencePerpetrator = {
  nuclear_family: "nuclear_family",
  close_family: "close_family",
  current_partner: "current_partner",
  ex_partner: "ex_partner",
  work_colleague: "work_colleague",
  other_people: "other_people",
};

exports.ViolenceLocation = exports.$Enums.ViolenceLocation = {
  home_space: "home_space",
  public_space: "public_space",
  work_space: "work_space",
  internet_space: "internet_space",
};

exports.LegalActionsTaken = exports.$Enums.LegalActionsTaken = {
  physical_examination: "physical_examination",
  police_inquiry: "police_inquiry",
  criminal_case: "criminal_case",
  civil_case: "civil_case",
  labour_case: "labour_case",
  police_report: "police_report",
  protective_measure: "protective_measure",
  none_taken: "none_taken",
};

exports.LegalActionDifficulty = exports.$Enums.LegalActionDifficulty = {
  discouraged: "discouraged",
  not_competent: "not_competent",
  refused_to_register: "refused_to_register",
  no_access_to_justice: "no_access_to_justice",
  denied_restraining_order: "denied_restraining_order",
  not_applicable: "not_applicable",
};

exports.ProtectiveFactor = exports.$Enums.ProtectiveFactor = {
  support_network: "support_network",
  dont_live_with_perpetrator: "dont_live_with_perpetrator",
  feels_safe: "feels_safe",
  is_not_dependant: "is_not_dependant",
  has_qualified_public_services: "has_qualified_public_services",
  not_applicable: "not_applicable",
};

exports.RiskFactor = exports.$Enums.RiskFactor = {
  gun_access: "gun_access",
  private_captivity: "private_captivity",
  violence_during_pregnancy: "violence_during_pregnancy",
  denied_public_services: "denied_public_services",
  no_support_network: "no_support_network",
  perpetrator_is_a_criminal: "perpetrator_is_a_criminal",
  perpetrator_is_imprisoned: "perpetrator_is_imprisoned",
  feels_isolated: "feels_isolated",
  other_risks: "other_risks",
  needed_medical_attention: "needed_medical_attention",
  not_applicable: "not_applicable",
};

exports.MonthlyIncome = exports.$Enums.MonthlyIncome = {
  yes: "yes",
  no: "no",
  no_access: "no_access",
};

exports.MonthlyIncomeRange = exports.$Enums.MonthlyIncomeRange = {
  no_income: "no_income",
  half_minimum_wage: "half_minimum_wage",
  up_to_one_minimum_wage: "up_to_one_minimum_wage",
  up_to_two_minimum_wages: "up_to_two_minimum_wages",
  up_to_three_minimum_wages: "up_to_three_minimum_wages",
  up_to_four_minimum_wages: "up_to_four_minimum_wages",
  five_minimum_wages_or_more: "five_minimum_wages_or_more",
};

exports.EmploymentStatus = exports.$Enums.EmploymentStatus = {
  employed_clt: "employed_clt",
  employed_pj: "employed_pj",
  student: "student",
  student_with_income: "student_with_income",
  retired: "retired",
  unemployed: "unemployed",
};

exports.FamilyProvider = exports.$Enums.FamilyProvider = {
  yes: "yes",
  no: "no",
  shared_responsibility: "shared_responsibility",
};

exports.SupportType = exports.$Enums.SupportType = {
  psychological: "psychological",
  legal: "legal",
};

exports.SupportRequestsStatus = exports.$Enums.SupportRequestsStatus = {
  open: "open",
  matched: "matched",
  social_worker: "social_worker",
  scheduled_social_worker: "scheduled_social_worker",
  expired_social_worker: "expired_social_worker",
  public_service: "public_service",
  public_service_with_social_worker: "public_service_with_social_worker",
  waiting_for_match: "waiting_for_match",
  waiting_for_match_with_priority: "waiting_for_match_with_priority",
  waiting_for_confirmation: "waiting_for_confirmation",
  duplicated: "duplicated",
  closed: "closed",
  special_case: "special_case",
  waived: "waived",
};

exports.MatchType = exports.$Enums.MatchType = {
  msr: "msr",
  daily: "daily",
  manual: "manual",
  old: "old",
};

exports.MatchStage = exports.$Enums.MatchStage = {
  ideal: "ideal",
  expanded: "expanded",
  online: "online",
  old: "old",
  manual: "manual",
};

exports.MatchStatus = exports.$Enums.MatchStatus = {
  completed: "completed",
  expired: "expired",
  in_contact: "in_contact",
  interrupted_after_support: "interrupted_after_support",
  interrupted_before_support: "interrupted_before_support",
  waiting_contact: "waiting_contact",
  started_contact: "started_contact",
};

exports.MatchConfirmationStatus = exports.$Enums.MatchConfirmationStatus = {
  waiting: "waiting",
  confirmed: "confirmed",
  denied: "denied",
  expired: "expired",
  undelivered: "undelivered",
};

exports.SurveyType = exports.$Enums.SurveyType = {
  triagem_1: "triagem_1",
  triagem_2: "triagem_2",
  acompanhamento_1: "acompanhamento_1",
  acompanhamento_2: "acompanhamento_2",
};

exports.VolunteerTrainingEvent = exports.$Enums.VolunteerTrainingEvent = {
  started_training: "started_training",
  finished_training: "finished_training",
};

exports.Region = exports.$Enums.Region = {
  norte: "norte",
  nordeste: "nordeste",
  centro_oeste: "centro_oeste",
  sudeste: "sudeste",
  sul: "sul",
  not_found: "not_found",
};

exports.MultiplierHouseholdType = exports.$Enums.MultiplierHouseholdType = {
  urban: "urban",
  rural: "rural",
  not_found: "not_found",
};

exports.Sexuality = exports.$Enums.Sexuality = {
  lesbian: "lesbian",
  bisexual: "bisexual",
  heterosexual: "heterosexual",
  asexual: "asexual",
  not_found: "not_found",
};

exports.Religion = exports.$Enums.Religion = {
  atheist: "atheist",
  candomble: "candomble",
  catholic: "catholic",
  spiritist: "spiritist",
  evangelical: "evangelical",
  umbanda: "umbanda",
  others: "others",
  not_found: "not_found",
};

exports.EducationLevel = exports.$Enums.EducationLevel = {
  basic_education: "basic_education",
  high_school: "high_school",
  completed_undergraduate: "completed_undergraduate",
  incomplete_undergraduate: "incomplete_undergraduate",
  not_found: "not_found",
};

exports.MultiplierUniversityType = exports.$Enums.MultiplierUniversityType = {
  public: "public",
  private: "private",
  not_found: "not_found",
};

exports.MultiplierJourneyEvent = exports.$Enums.MultiplierJourneyEvent = {
  registration: "registration",
  general_onboarding: "general_onboarding",
};

exports.DisabilityType = exports.$Enums.DisabilityType = {
  physical: "physical",
  visual: "visual",
  hearing: "hearing",
  intellectual: "intellectual",
  psychic: "psychic",
  multiple: "multiple",
  not_pcd: "not_pcd",
};

exports.WeeklyHours = exports.$Enums.WeeklyHours = {
  one_hour: "one_hour",
  two_hours: "two_hours",
  three_to_five_hours: "three_to_five_hours",
  more_than_five_hours: "more_than_five_hours",
};

exports.ContractFormat = exports.$Enums.ContractFormat = {
  remote: "remote",
  in_person: "in_person",
  hybrid: "hybrid",
};

exports.ViolenceAwareness = exports.$Enums.ViolenceAwareness = {
  yes: "yes",
  no: "no",
  insufficient_input: "insufficient_input",
};

exports.MainDemandCategory = exports.$Enums.MainDemandCategory = {
  family_law: "family_law",
  criminal_law: "criminal_law",
  labor_law: "labor_law",
  property_rights: "property_rights",
  justice_system_info: "justice_system_info",
  other: "other",
};

exports.ProBonoInCaseFiles = exports.$Enums.ProBonoInCaseFiles = {
  yes: "yes",
  no: "no",
  not_applicable: "not_applicable",
};

exports.SafetyPlanUsed = exports.$Enums.SafetyPlanUsed = {
  yes: "yes",
  no: "no",
  not_applicable: "not_applicable",
};

exports.PublicServiceReferralType = exports.$Enums.PublicServiceReferralType = {
  referral_with_interruption: "referral_with_interruption",
  articulation_with_continuity: "articulation_with_continuity",
  not_applicable: "not_applicable",
};

exports.PublicServiceReferralReason =
  exports.$Enums.PublicServiceReferralReason = {
    physical_psychological_risk: "physical_psychological_risk",
    mental_health_demand: "mental_health_demand",
    social_vulnerability: "social_vulnerability",
    exceeds_scope: "exceeds_scope",
    no_need_identified: "no_need_identified",
  };

exports.PsychologistContact = exports.$Enums.PsychologistContact = {
  in_contact: "in_contact",
  not_in_contact: "not_in_contact",
  not_receiving_support: "not_receiving_support",
};

exports.PsychologistCollaboration = exports.$Enums.PsychologistCollaboration = {
  yes: "yes",
  no: "no",
  not_applicable: "not_applicable",
};

exports.SupportSatisfaction = exports.$Enums.SupportSatisfaction = {
  yes: "yes",
  no: "no",
  not_applicable: "not_applicable",
};

exports.ExtraContactFrequency = exports.$Enums.ExtraContactFrequency = {
  once_a_week: "once_a_week",
  twice_a_week: "twice_a_week",
  three_or_more_times_a_week: "three_or_more_times_a_week",
  on_weekends: "on_weekends",
};

exports.LawyerContact = exports.$Enums.LawyerContact = {
  in_contact: "in_contact",
  not_in_contact: "not_in_contact",
  not_receiving_support: "not_receiving_support",
};

exports.LawyerCollaboration = exports.$Enums.LawyerCollaboration = {
  yes: "yes",
  no: "no",
  not_applicable: "not_applicable",
};

exports.IrregularAttendanceReason = exports.$Enums.IrregularAttendanceReason = {
  missed_without_notice: "missed_without_notice",
  forgetfulness: "forgetfulness",
  last_minute_cancellation: "last_minute_cancellation",
  domestic_care_overload: "domestic_care_overload",
  prevented_by_perpetrator: "prevented_by_perpetrator",
  other: "other",
  not_applicable: "not_applicable",
};

exports.InterruptionReason = exports.$Enums.InterruptionReason = {
  volunteer_suspension_or_exit: "volunteer_suspension_or_exit",
  msr_not_eligible: "msr_not_eligible",
  no_bonding: "no_bonding",
  msr_opted_out: "msr_opted_out",
  msr_disappeared: "msr_disappeared",
  conflict_of_interest: "conflict_of_interest",
  schedule_incompatibility: "schedule_incompatibility",
  divergent_legal_area: "divergent_legal_area",
  support_outside_project: "support_outside_project",
  msr_needs_in_person: "msr_needs_in_person",
  public_service_referral_needed: "public_service_referral_needed",
};

exports.RedirectAreaNeeded = exports.$Enums.RedirectAreaNeeded = {
  civil: "civil",
  family: "family",
  labor: "labor",
  criminal: "criminal",
};

exports.ExitOrSuspend = exports.$Enums.ExitOrSuspend = {
  exit: "exit",
  suspend: "suspend",
};

exports.SuspensionCategory = exports.$Enums.SuspensionCategory = {
  one_month: "one_month",
  three_months: "three_months",
  six_months: "six_months",
};

exports.SuspensionReason = exports.$Enums.SuspensionReason = {
  vacation: "vacation",
  work_or_study: "work_or_study",
  maternity: "maternity",
  health: "health",
  other: "other",
};

exports.InstrumentalType = exports.$Enums.InstrumentalType = {
  quality_of_life_d0: "quality_of_life_d0",
  quality_of_life_d90: "quality_of_life_d90",
  quality_of_life_d180: "quality_of_life_d180",
  quality_of_life_d270: "quality_of_life_d270",
  psychological_support_evaluation: "psychological_support_evaluation",
  legal_support_evaluation: "legal_support_evaluation",
  msr_psychological_support_conclusion: "msr_psychological_support_conclusion",
  msr_legal_support_conclusion: "msr_legal_support_conclusion",
  psychological_support_follow_up_i: "psychological_support_follow_up_i",
  psychological_support_follow_up_ii: "psychological_support_follow_up_ii",
  legal_support_follow_up_i: "legal_support_follow_up_i",
  legal_support_follow_up_ii: "legal_support_follow_up_ii",
  volunteer_psychological_support_conclusion:
    "volunteer_psychological_support_conclusion",
  volunteer_legal_support_conclusion: "volunteer_legal_support_conclusion",
  support_interruption: "support_interruption",
};

exports.InstrumentalStatus = exports.$Enums.InstrumentalStatus = {
  sent: "sent",
  answered: "answered",
};

exports.Prisma.ModelName = {
  auth_group: "auth_group",
  auth_group_permissions: "auth_group_permissions",
  auth_permission: "auth_permission",
  auth_user: "auth_user",
  auth_user_groups: "auth_user_groups",
  auth_user_user_permissions: "auth_user_user_permissions",
  django_admin_log: "django_admin_log",
  django_content_type: "django_content_type",
  django_migrations: "django_migrations",
  django_session: "django_session",
  integrations_logs: "integrations_logs",
  Volunteers: "Volunteers",
  volunteers_formdata: "volunteers_formdata",
  MSRs: "MSRs",
  MSRPiiSec: "MSRPiiSec",
  MSRStatusHistory: "MSRStatusHistory",
  MSRViolenceHistory: "MSRViolenceHistory",
  MSRSocioeconomicData: "MSRSocioeconomicData",
  SupportRequests: "SupportRequests",
  SupportRequestStatusHistory: "SupportRequestStatusHistory",
  Matches: "Matches",
  MatchConfirmations: "MatchConfirmations",
  MatchConfirmationStatusHistory: "MatchConfirmationStatusHistory",
  MatchStatusHistory: "MatchStatusHistory",
  MatchSurveys: "MatchSurveys",
  Cities: "Cities",
  VolunteerAvailability: "VolunteerAvailability",
  VolunteerStatusHistory: "VolunteerStatusHistory",
  VolunteerSegments: "VolunteerSegments",
  VolunteerUnsubscriptions: "VolunteerUnsubscriptions",
  VolunteerTrainingHistory: "VolunteerTrainingHistory",
  FeatureFlag: "FeatureFlag",
  BusaraHashes: "BusaraHashes",
  Mutipliers: "Mutipliers",
  MutiplierPii: "MutiplierPii",
  MultiplierRegistrationOpenQuestions: "MultiplierRegistrationOpenQuestions",
  MultiplierJourneyEvents: "MultiplierJourneyEvents",
  PublicServices: "PublicServices",
  BusaraABExperiment: "BusaraABExperiment",
  SurveyQualityOfLifeD0: "SurveyQualityOfLifeD0",
  SurveyQualityOfLifeD90: "SurveyQualityOfLifeD90",
  SurveyQualityOfLifeD180: "SurveyQualityOfLifeD180",
  SurveyQualityOfLifeD270: "SurveyQualityOfLifeD270",
  PsychologicalSupportEvaluation: "PsychologicalSupportEvaluation",
  LegalSupportEvaluation: "LegalSupportEvaluation",
  MsrPsychologicalSupportConclusion: "MsrPsychologicalSupportConclusion",
  MsrLegalSupportConclusion: "MsrLegalSupportConclusion",
  LegalSupportFollowUpI: "LegalSupportFollowUpI",
  LegalSupportFollowUpII: "LegalSupportFollowUpII",
  VolunteerLegalSupportConclusion: "VolunteerLegalSupportConclusion",
  PsychologicalSupportFollowUpI: "PsychologicalSupportFollowUpI",
  PsychologicalSupportFollowUpII: "PsychologicalSupportFollowUpII",
  VolunteerPsychologicalSupportConclusion:
    "VolunteerPsychologicalSupportConclusion",
  SupportInterruption: "SupportInterruption",
  MsrInstrumentalRecord: "MsrInstrumentalRecord",
  VolunteerInstrumentalRecord: "VolunteerInstrumentalRecord",
  MdaFormsAnswers: "MdaFormsAnswers",
  iana_feedback: "iana_feedback",
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message;
        const runtime = getRuntime();
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message =
            "PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `" +
            runtime.prettyName +
            "`).";
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;

        throw new Error(message);
      },
    });
  }
}

exports.PrismaClient = PrismaClient;

Object.assign(exports, Prisma);
