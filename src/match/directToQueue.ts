import client from "../prismaClient";
import { getCurrentDate } from "../utils";
import { getUser, updateTicket } from "../zendeskClient";
import { sendEmailQueue } from "../emailClient";
import type { SupportRequest } from "../types";
import { ZENDESK_CUSTOM_FIELDS_DICIO, AGENT } from "../constants";

async function fetchMsrFromZendesk(msrId: bigint) {
  const msr = await getUser(msrId);

  return msr;
}

async function updateMsrZendeskTicketWithQueue(
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
        value: "aguardando_match__sem_prioridade",
      },
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["data_encaminhamento"],
        value: getCurrentDate(),
      },
    ],
    comment: {
      body: "Não encontramos uma voluntária próxima disponível e MSR foi encaminhada para a fila do Match Diário.",
      public: false,
    },
  };

  const zendeskTicket = await updateTicket(ticket);

  return zendeskTicket ? zendeskTicket : null;
}

export type Queue = Pick<SupportRequest, "zendeskTicketId" | "msrId">;

export default async function directToQueue(
  supportRequestId: number
): Promise<Queue> {
  const updateSupportRequest = await client.supportRequests.update({
    where: {
      supportRequestId: supportRequestId,
    },
    data: {
      status: "waiting_for_match",
      SupportRequestStatusHistory: {
        create: {
          status: "waiting_for_match",
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

  const updatedTicket = await updateMsrZendeskTicketWithQueue(
    updateSupportRequest.zendeskTicketId
  );

  await sendEmailQueue(
    zendeskUser.email,
    zendeskUser.name,
    updatedTicket?.encoded_id.toString() || ""
  );

  return updateSupportRequest;
}
