import type { SupportRequests } from "@prisma/client";
import client from "../prismaClient";
import { getCurrentDate } from "../utils";
import { getUser, updateTicket } from "../zendeskClient";
import {
  SOCIAL_WORKER_ZENDESK_USER_ID,
  ZENDESK_CUSTOM_FIELDS_DICIO,
} from "../constants";
import { sendEmailSocialWorker } from "../emailClient";

async function fetchMsrFromZendesk(msrId: bigint) {
  const msr = await getUser(msrId);

  return msr;
}

type UpdateTicketMsr = Pick<
  SupportRequests,
  "zendeskTicketId" | "state" | "status"
>;

async function updateMsrZendeskTicketWithSocialworker(msr: UpdateTicketMsr) {
  const ticket = {
    id: msr.zendeskTicketId,
    status: "pending",
    assignee_id: SOCIAL_WORKER_ZENDESK_USER_ID,
    custom_fields: [
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["estado"],
        value: msr.state,
      },
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["status_acolhimento"],
        value: "encaminhamento__assistente_social",
      },
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["data_encaminhamento"],
        value: getCurrentDate(),
      },
    ],
    comment: {
      body: "Não encontramos uma voluntária próxima disponível e MSR foi encaminhada para assistente social.",
      public: false,
    },
  };

  const zendeskTicket = await updateTicket(ticket);

  return zendeskTicket ? zendeskTicket.id : null;
}

export type SocialWorker = Pick<
  SupportRequests,
  "state" | "zendeskTicketId" | "msrId" | "status"
>;

export default async function directToSocialWorker(
  supportRequestId: number
): Promise<SocialWorker> {
  const updateSupportRequest = await client.supportRequests.update({
    where: {
      supportRequestId: supportRequestId,
    },
    data: {
      status: "social_worker",
      SupportRequestStatusHistory: {
        create: {
          status: "social_worker",
        },
      },
    },
    select: {
      state: true,
      zendeskTicketId: true,
      msrId: true,
      status: true,
    },
  });

  const zendeskUser = await fetchMsrFromZendesk(updateSupportRequest.msrId);

  if (!zendeskUser) {
    throw new Error("Couldn't fetch msr from zendesk");
  }

  await updateMsrZendeskTicketWithSocialworker(updateSupportRequest);

  await sendEmailSocialWorker(
    zendeskUser.email,
    zendeskUser.name,
    updateSupportRequest.zendeskTicketId.toString()
  );

  return updateSupportRequest;
}
