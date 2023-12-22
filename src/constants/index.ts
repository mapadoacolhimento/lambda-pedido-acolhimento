export const ZENDESK_SUBDOMAIN = process.env["ZENDESK_SUBDOMAIN"];
export const ZENDESK_API_URL = `${ZENDESK_SUBDOMAIN}/api/v2`;
export const ZENDESK_API_USER = process.env["ZENDESK_API_USER"];
export const ZENDESK_API_TOKEN = process.env["ZENDESK_API_TOKEN"];

export const AGENT_DICIO: Record<number, string> = {
  377511446392: "Gabriela",
  377577169651: "Ana",
};

export const IDEAL_MATCH_MAX_DISTANCE = 20;

export const ZENDESK_CUSTOM_FIELDS_DICIO = {
  nome_msr: 360016681971,
  link_match: 360016631632,
  status_acolhimento: 360014379412,
  data_encaminhamento: 360017432652,
  nome_voluntaria: 360016631592,
  estado: 360021879791,
};

export const VOLUNTEER_SUPPORT_TYPE_DICIO = {
  psychological: {
    organizationId: 360282119532,
    occupation: "Psicóloga",
    registryType: "CRP",
  },
  legal: {
    organizationId: 360269610652,
    occupation: "Advogada",
    registryType: "OAB",
  },
};