export const ZENDESK_SUBDOMAIN = process.env["ZENDESK_SUBDOMAIN"];
export const ZENDESK_API_URL = `${ZENDESK_SUBDOMAIN}/api/v2`;
export const ZENDESK_API_USER = process.env["ZENDESK_API_USER"];
export const ZENDESK_API_TOKEN = process.env["ZENDESK_API_TOKEN"];

export const agentDicio: Record<number, string> = {
  377511446392: "Gabriela",
  377577169651: "Ana",
};

export const IDEAL_MATCH_MAX_DISTANCE = 20;
