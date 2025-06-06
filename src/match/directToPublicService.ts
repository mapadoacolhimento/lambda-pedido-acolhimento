import client from "../prismaClient";
import { getCurrentDate } from "../utils";
import { getUser, updateTicket } from "../zendeskClient";
import { sendEmailPublicService } from "../emailClient";
import type { SupportRequest } from "../types";
import { ZENDESK_CUSTOM_FIELDS_DICIO, AGENT } from "../constants";

async function fetchMsrFromZendesk(msrId: bigint) {
  const msr = await getUser(msrId);

  return msr;
}

async function updateMsrZendeskTicketWithPublicService(
  msrZendeskTicketId: SupportRequest["zendeskTicketId"]
) {
  const agent = AGENT.id;

  const ticket = {
    id: msrZendeskTicketId,
    status: "pending",
    assignee_id: agent,
    custom_fields: [
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["status_acolhimento"],
        value: "encaminhamento__realizado_para_serviço_público",
      },
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["data_encaminhamento"],
        value: getCurrentDate(),
      },
    ],
    comment: {
      body: "Não encontramos uma voluntária próxima disponível e MSR foi encaminhada para serviço público.",
      public: false,
    },
  };

  const zendeskTicket = await updateTicket(ticket);

  return zendeskTicket ? zendeskTicket : null;
}

export type PublicService = Pick<SupportRequest, "zendeskTicketId" | "msrId">;

export default async function directToPublicService(
  supportRequestId: number
): Promise<PublicService> {
  const updateSupportRequest = await client.supportRequests.update({
    where: {
      supportRequestId: supportRequestId,
    },
    data: {
      status: "public_service",
      SupportRequestStatusHistory: {
        create: {
          status: "public_service",
        },
      },
    },
    select: {
      zendeskTicketId: true,
      msrId: true,
    },
  });

  const zendeskUser = await fetchMsrFromZendesk(updateSupportRequest.msrId);

  if (!zendeskUser) {
    throw new Error("Couldn't fetch msr from zendesk");
  }

  const updatedTicket = await updateMsrZendeskTicketWithPublicService(
    updateSupportRequest.zendeskTicketId
  );

  await sendEmailPublicService(
    zendeskUser.email,
    zendeskUser.name,
    updatedTicket?.encoded_id ? updatedTicket?.encoded_id : ""
  );

  return updateSupportRequest;
}
