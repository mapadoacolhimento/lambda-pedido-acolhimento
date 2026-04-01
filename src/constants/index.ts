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
export const NEW_EMAIL_TO_VOLUNTEER_FEATURE_FLAG = "NEW_EMAIL_TO_VOLUNTEER";

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

export const TRANSATIONAL_EMAIL_WITH_INFO = {
  psychological: {
    msr: "clv4977jg01a7hlj1twd22zq1",
    volunteer: "cmn6it2qq00640iyhikye2b77",
  },
  legal: {
    msr: "clv43f8gd02evj3woijkqcgng",
    volunteer: "cmn6gu68l0bfp0i250o3o2py1",
  },
};

export const MONTHLY_INCOME_RANGES = {
  no_income: "Sem renda",
  half_minimum_wage: "Até meio salário mínimo",
  up_to_one_minimum_wage: "Entre meio a um salário mínimo",
  up_to_two_minimum_wages: "Entre um a dois salários mínimos",
  up_to_three_minimum_wages: "Entre dois a três salários mínimos",
  up_to_four_minimum_wages: "Entre três a quatro salários mínimos",
  five_minimum_wages_or_more: "Cinco salários mínimos ou mais",
};

export const EMPLOYMENT_STATUS = {
  employed_clt: "Empregada (CLT)",
  employed_pj: "Empregada (PJ)",
  student: "Estudante",
  student_with_income: "Estudante com renda",
  retired: "Aposentada",
  unemployed: "Desempregada",
};

export const HAS_MONTHLY_INCOME = {
  yes: "Sim",
  no: "Não",
  no_access: "Sem acesso a renda",
};

export const FAMILY_PROVIDER = {
  yes: "Sim",
  no: "Não",
  shared_responsibility: "Divide a responsabilidade com outra pessoa",
};

export const VIOLENCE_TYPES = {
  physical_violence: "Violência física",
  psychological_violence: "Violência psicológica",
  sexual_violence: "Violência sexual",
  moral_violence: "Violência moral",
  digital_violence: "Violência digital",
  patrimonial_violence: "Violência patrimonial",
  obstetric_violence: "Violência obstétrica",
  threat: "Ameaça",
  political_violence: "Violência política",
  no_violence: "Sem violência",
};

export const VIOLENCE_TIME = {
  isolated_episode: "Episódio isolado",
  last_week: " Na última semana",
  last_month: "No último mês",
  less_than_3_months: "Nos últimos 3 meses",
  between_3_months_and_1_year: "Entre 3 meses e 1 ano",
  between_1_and_3_years: "Entre 1 e 3 anos",
  between_3_and_6_years: "Entre 3 e 6 anos",
  between_6_and_10_years: "Entre 6 e 10 anos",
  more_than_10_years: "Mais de 10 anos",
};

export const PREPATATOR_GENDER = {
  woman: "Mulher",
  man: "Homem",
  non_binary: "Não-binário",
};

export const VIOLENCE_PERPETRATOR = {
  nuclear_family: "Família nuclear",
  close_family: "Família próxima",
  current_partner: "Parceiro(a) atual",
  ex_partner: "Parceiro(a) anterior",
  work_colleague: "Colega de trabalho",
  other_people: "Outras pessoas",
};

export const LIVES_WITH_PERPETRATOR = {
  yes: "Sim",
  no: "Não",
  never: "Nunca",
};

export const VIOLENCE_LOCATION = {
  home_space: "Ambiente doméstico",
  public_space: "Ambiente Público",
  work_space: "Ambiente de trabalho",
  internet_space: "Internet/rede sociais",
};

export const LEGAL_ACTION_DIFFICULTY = {
  discouraged: "Desencorajou sob o argumento de inexistência criminosa",
  not_competent: "Informou não ser de sua competência",
  refused_to_register: "Negou-se a registrar a ocorrência",
  no_access_to_justice: "Não viabilizou o acesso à justiça",
  denied_restraining_order: "Negou o requerimento à medida protetiva",
  not_applicable: "Não se aplica",
};

export const LEGAL_ACTION_TAKEN = {
  physical_examination: "Exame de corpo de delito (IML)",
  police_inquiry: "Inquérito policial",
  criminal_case: "Processo Penal/Criminal",
  civil_case: "Processo Cível/Direito de Família",
  labour_case: "Processo trabalhista",
  police_report: "Registro de Ocorrência (B.O)",
  protective_measure: "equerimento de Medida Protetiva (Delegacia de Polícia)",
  none_taken: "Não foi realizada nenhuma providência jurídica",
};

export const GENDER = {
  cis_woman: "Mulher cisgênero",
  trans_woman: "Mulher transgênero/travesti",
  not_found: "Não informado",
};
