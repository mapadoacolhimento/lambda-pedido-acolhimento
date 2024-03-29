import client from "../prismaClient";
import getMsrEmail from "./getMsrEmail";
import { getAgent, getCurrentDate } from "../utils";
import { getUser, updateTicket } from "../zendeskClient";
import {
  SOCIAL_WORKER,
  SOCIAL_WORKER_ZENDESK_USER_ID,
  ZENDESK_CUSTOM_FIELDS_DICIO,
} from "../constants";
import type { SupportRequest, ZendeskUser } from "../types";

async function fetchMsrFromZendesk(msrId: bigint) {
  const msr = await getUser(msrId);

  return msr;
}

type UpdateTicketMsr = Pick<
  SupportRequest,
  "zendeskTicketId" | "state" | "supportType"
> &
  Pick<ZendeskUser, "email" | "name">;

async function updateMsrZendeskTicketWithSocialworker(msr: UpdateTicketMsr) {
  const agent = getAgent();

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
    comment: getMsrEmail({
      agent,
      msr,
      referralType: SOCIAL_WORKER,
    }),
  };

  const zendeskTicket = await updateTicket(ticket);

  return zendeskTicket ? zendeskTicket.id : null;
}

export type SocialWorker = Pick<
  SupportRequest,
  "state" | "zendeskTicketId" | "supportType" | "msrId"
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
      supportType: true,
      msrId: true,
    },
  });

  const zendeskUser = await fetchMsrFromZendesk(updateSupportRequest.msrId);

  if (!zendeskUser) {
    throw new Error("Couldn't fetch msr from zendesk");
  }

  await updateMsrZendeskTicketWithSocialworker({
    ...updateSupportRequest,
    email: zendeskUser.email,
    name: zendeskUser.name,
  });

  return updateSupportRequest;
}
