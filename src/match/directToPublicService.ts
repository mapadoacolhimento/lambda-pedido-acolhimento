import client from "../prismaClient";
import { getAgent, getCurrentDate } from "../utils";
import { updateTicket } from "../zendeskClient";
import { ZENDESK_CUSTOM_FIELDS_DICIO } from "../constants";
import type { SupportRequest } from "../types";

async function updateMsrZendeskTicketWithPublicService(
  zendeskTicketId: SupportRequest["zendeskTicketId"],
  msrState: SupportRequest["state"]
) {
  const agent = getAgent();

  const ticket = {
    id: zendeskTicketId,
    status: "pending",
    assignee_id: agent,
    custom_fields: [
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["estado"],
        value: msrState,
      },
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
      body: `Ticket da MSR foi atualizado após ela ser encaminhada para um serviço público`,
      author_id: agent,
      public: false,
    },
  };

  const zendeskTicket = await updateTicket(ticket);

  return zendeskTicket ? zendeskTicket.id : null;
}

export default async function directToPublicService(supportRequestId: number) {
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
      state: true,
      zendeskTicketId: true,
    },
  });

  await updateMsrZendeskTicketWithPublicService(
    updateSupportRequest.zendeskTicketId,
    updateSupportRequest.state
  );

  return updateSupportRequest;
}
