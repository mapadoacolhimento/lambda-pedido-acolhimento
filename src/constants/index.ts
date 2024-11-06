export const ZENDESK_SUBDOMAIN = process.env["ZENDESK_SUBDOMAIN"];
export const ZENDESK_API_URL = `${ZENDESK_SUBDOMAIN}/api/v2`;
export const ZENDESK_API_USER = `${process.env["ZENDESK_API_USER"]}/token`;
export const ZENDESK_API_TOKEN = process.env["ZENDESK_API_TOKEN"];

export const AGENT = {
  id: 377511446392,
  name: "Gabriela",
};

export const IDEAL_MATCH_MAX_DISTANCE = 20;

export const ZENDESK_CUSTOM_FIELDS_DICIO = {
  nome_msr: 360016681971,
  link_match: 360016631632,
  status_acolhimento: 360014379412,
  data_encaminhamento: 360017432652,
  nome_voluntaria: 360016631592,
};

const LAWYER_ZENDESK_ORGANIZATION_ID = 360269610652;
const THERAPIST_ZENDESK_ORGANIZATION_ID = 360282119532;

export const VOLUNTEER_SUPPORT_TYPE_DICIO = {
  psychological: {
    organizationId: THERAPIST_ZENDESK_ORGANIZATION_ID,
    occupation: "Psicóloga",
    registryType: "CRP",
  },
  legal: {
    organizationId: LAWYER_ZENDESK_ORGANIZATION_ID,
    occupation: "Advogada",
    registryType: "OAB",
  },
};

export const NEW_MATCH_FEATURE_FLAG = "NEW_MATCH";
export const SOCIAL_WORKER_FEATURE_FLAG = "SOCIAL_WORKER";

export const MSR_TEST_ZENDESK_USER_ID = "22858077211028";

export const ONLINE_MATCH = 1;
export const PUBLIC_SERVICE = 2;
export const SOCIAL_WORKER = 3;

export const SOCIAL_WORKER_ZENDESK_USER_ID = 415747628191;

export const TRANSACTIONAL_EMAIL_IDS = {
  publicService: "clv43j25d00b0y19vj7x8qdxy",
  queue: "cm33aco7o01o1tfg9a3hm7tyc",
  socialWorker: "clv4a8qf1004meoqo89fcfjy7",
  psychological: {
    msr: "clv4977jg01a7hlj1twd22zq1",
    volunteer: "clv5c4mim008rjwf7bqgvk2ga",
  },
  legal: {
    msr: "clv43f8gd02evj3woijkqcgng",
    volunteer: "clv43jw1t00yj79ezuug2kh6z",
  },
};
