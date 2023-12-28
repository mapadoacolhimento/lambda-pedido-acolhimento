import type { VolunteerAvailability, Volunteers } from "@prisma/client";
import client from "../prismaClient";
import getMsrEmail from "./getMsrEmail";
import { createTicket, getUser, updateTicket } from "../zendeskClient";
import { getAgent, getCurrentDate, getErrorMessage } from "../utils";
import {
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
    subject: `[${
      volunteerSupportTypeInfo.occupation
    }] ${volunteer.firstName.toString()}`,
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
