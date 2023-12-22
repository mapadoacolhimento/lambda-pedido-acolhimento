import type { SupportRequests } from "@prisma/client";
import client from "../prismaClient";
import { getAgent, getCurrentDate } from "../utils";
import { updateTicket } from "../zendeskClient";

async function updateMsrZendeskTicketWithPublicService(
  zendeskTicketId: SupportRequests["zendeskTicketId"],
  msrState: SupportRequests["state"]
) {
  const agent = getAgent();
  const ticket = {
    id: zendeskTicketId,
    status: "pending",
    assignee_id: agent,
    custom_fields: [
      {
        id: 360021879791,
        value: msrState,
      },
      {
        id: 360014379412,
        value: "encaminhamento__realizado_para_serviço_público",
      },
      {
        id: 360017432652,
        value: String(getCurrentDate()),
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

export async function directToPublicService(supportRequestId: number) {
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
