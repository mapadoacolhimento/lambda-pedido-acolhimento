import client from "../prismaClient";
import getMsrEmail from "./getMsrEmail";
import { getAgent, getCurrentDate } from "../utils";
import { getUser, updateTicket } from "../zendeskClient";
import { PUBLIC_SERVICE, ZENDESK_CUSTOM_FIELDS_DICIO } from "../constants";
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

async function updateMsrZendeskTicketWithPublicService(msr: UpdateTicketMsr) {
  const agent = getAgent();

  const ticket = {
    id: msr.zendeskTicketId,
    status: "pending",
    assignee_id: agent,
    custom_fields: [
      {
        id: ZENDESK_CUSTOM_FIELDS_DICIO["estado"],
        value: msr.state,
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
    comment: getMsrEmail({
      agent,
      msr,
      referralType: PUBLIC_SERVICE
    }),
  };

  const zendeskTicket = await updateTicket(ticket);

  return zendeskTicket ? zendeskTicket.id : null;
}

export type PublicService = Pick<
  SupportRequest,
  "state" | "zendeskTicketId" | "supportType" | "msrId"
>;

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

  await updateMsrZendeskTicketWithPublicService({
    ...updateSupportRequest,
    email: zendeskUser.email,
    name: zendeskUser.name,
  });

  return updateSupportRequest;
}
