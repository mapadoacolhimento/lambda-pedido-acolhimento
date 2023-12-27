import type { VolunteerAvailability, Volunteers } from "@prisma/client";
import client from "../prismaClient";
import { createTicket, getUser, updateTicket } from "../zendeskClient";
import { getAgent, getCurrentDate, getErrorMessage } from "../utils";
import {
  AGENT_DICIO,
  ZENDESK_CUSTOM_FIELDS_DICIO,
  VOLUNTEER_SUPPORT_TYPE_DICIO,
  ZENDESK_SUBDOMAIN,
} from "../constants";
import type { SupportRequest, ZendeskUser } from "../types";

type ZendeskTicketParams = {
  agent: number;
  volunteer: Volunteer;
  msr: Pick<SupportRequest, "zendeskTicketId" | "supportType"> & {
    name: ZendeskUser["name"];
    zendeskUserId: bigint;
  };
};

async function createVolunteerZendeskTicket({
  agent,
  volunteer,
  msr,
}: ZendeskTicketParams) {
  const volunteerSupportTypeInfo =
    VOLUNTEER_SUPPORT_TYPE_DICIO[msr.supportType];

  const ticket = {
    external_id: msr.zendeskUserId,
    requester_id: volunteer.zendeskUserId!,
    submitter_id: agent,
    assignee_id: agent,
    status: "pending",
    subject: `[${volunteerSupportTypeInfo.occupation}] ${volunteer.firstName}`,
    organization_id: volunteerSupportTypeInfo.organizationId,
    comment: {
      body: `Voluntária recebeu um pedido de acolhimento de ${msr.name}`,
      author_id: agent,
      public: false,
    },
    custom_fields: [
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["nome_msr"],
        value: msr.name,
      },
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["link_match"],
        value: `${ZENDESK_SUBDOMAIN}/agent/tickets/${msr.zendeskTicketId}`,
      },
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["status_acolhimento"],
        value: "encaminhamento__realizado",
      },
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["data_encaminhamento"],
        value: getCurrentDate(),
      },
    ],
  };

  const zendeskTicket = await createTicket(ticket);

  return zendeskTicket ? zendeskTicket.id : null;
}

type MsrEmailParams = {
  volunteer: Volunteer;
  agent: number;
  msr: ZendeskUser & Pick<SupportRequest, "supportType">;
};

export function getMsrEmail({ volunteer, agent, msr }: MsrEmailParams) {
  const volunteerSupportTypeInfo =
    VOLUNTEER_SUPPORT_TYPE_DICIO[msr.supportType];

  return `Olá, ${msr.name}!
  
  Boa notícia!
  
  Conseguimos localizar uma ${volunteerSupportTypeInfo.occupation.toLowerCase()} disponível próxima a você. Estamos te enviando os dados abaixo para que entre em contato em até 30 dias. É muito importante atentar-se a esse prazo pois, após esse período, a sua vaga pode expirar. Não se preocupe, caso você não consiga, poderá retornar à fila de atendimento se cadastrando novamente pelo site.
  
  ${volunteerSupportTypeInfo.occupation}: ${volunteer.firstName}
  
  Telefone: ${volunteer.phone}
  
  ${volunteerSupportTypeInfo.registryType}: ${volunteer.registrationNumber}
  
  Diante do contexto da pandemia do covid-19, sabemos que podem surgir algumas dificuldades para que receba o acolhimento necessário, especialmente à distância, que é a recomendação neste momento. Por isso, caso haja algum obstáculo que impossibilite que o seu atendimento aconteça de forma segura, por favor nos escreva e para te oferecermos mais informações sobre como buscar ajuda na rede pública de atendimento. Não se preocupe, você também poderá iniciar os atendimentos de modo presencial quando esse período tão difícil passar.
  
  Todos os atendimentos do Mapa devem ser gratuitos pelo tempo que durarem. Caso você seja cobrada, comunique imediatamente a nossa equipe. No momento de contato com a voluntária, por favor, identifique que você buscou ajuda via Mapa do Acolhimento.
  
  Agradecemos pela coragem, pela confiança e esperamos que seja bem acolhida! Pedimos que entre em contato para compartilhar a sua experiência de atendimento.
  
  Um abraço,
  
  ${AGENT_DICIO[agent]} do Mapa do Acolhimento`;
}

type UpdateTicketParams = {
  agent: number;
  volunteer: Volunteer & {
    zendeskTicketId: bigint;
  };
  msr: {
    zendeskTicketId: SupportRequest["zendeskTicketId"];
    email: string;
  };
};

async function updateMsrZendeskTicketWithMatch({
  agent,
  volunteer,
  msr,
}: UpdateTicketParams) {
  const ticket = {
    id: msr.zendeskTicketId,
    status: "pending",
    assignee_id: agent,
    custom_fields: [
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["nome_voluntaria"],
        value: volunteer.firstName,
      },
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["status_acolhimento"],
        value: "encaminhamento__realizado",
      },
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["link_match"],
        value: `${ZENDESK_SUBDOMAIN}/agent/tickets/${volunteer.zendeskTicketId}`,
      },
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["data_encaminhamento"],
        value: getCurrentDate(),
      },
    ],
    comment: {
      body: msr.email,
      author_id: agent,
      public: true,
    },
  };

  const zendeskTicket = await updateTicket(ticket);

  return zendeskTicket;
}

type Volunteer = Pick<
  Volunteers,
  "firstName" | "zendeskUserId" | "phone" | "registrationNumber"
>;

async function fetchVolunteerFromDB(
  volunteerId: number
): Promise<Volunteer | null> {
  try {
    const volunteer = await client.volunteers.findUnique({
      where: {
        id: volunteerId,
      },
      select: {
        firstName: true,
        zendeskUserId: true,
        phone: true,
        registrationNumber: true,
      },
    });

    return volunteer;
  } catch (e) {
    console.log(
      `Something went wrong when fetching this volunteer from db '${volunteerId}': ${getErrorMessage(
        e
      )}`
    );
    return null;
  }
}

async function fetchMsrFromZendesk(msrId: bigint) {
  const msr = await getUser(msrId);

  return msr;
}

export default async function createAndUpdateZendeskMatchTickets(
  supportRequest: SupportRequest,
  volunteerId: VolunteerAvailability["volunteer_id"]
) {
  const volunteer = await fetchVolunteerFromDB(volunteerId);
  const msr = await fetchMsrFromZendesk(supportRequest.msrId);

  if (!volunteer || !msr) {
    throw new Error("Couldn't fetch volunteer from db or msr from zendesk");
  }

  const agent = getAgent();

  const volunteerZendeskTicketId = await createVolunteerZendeskTicket({
    agent,
    volunteer,
    msr: {
      name: msr.name,
      zendeskUserId: msr.id,
      zendeskTicketId: supportRequest.zendeskTicketId,
      supportType: supportRequest.supportType,
    },
  });

  if (!volunteerZendeskTicketId) {
    throw new Error("Couldn't create volunteer match ticket");
  }

  const msrEmail = getMsrEmail({
    volunteer,
    agent,
    msr: {
      ...msr,
      supportType: supportRequest.supportType,
    },
  });

  await updateMsrZendeskTicketWithMatch({
    agent,
    volunteer: {
      ...volunteer,
      zendeskTicketId: volunteerZendeskTicketId,
    },
    msr: {
      zendeskTicketId: supportRequest.zendeskTicketId,
      email: msrEmail,
    },
  });

  return volunteerZendeskTicketId;
}
