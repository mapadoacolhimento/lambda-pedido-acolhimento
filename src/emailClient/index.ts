import type { Volunteers } from "@prisma/client";
import sendEmail from "./sendEmail";
import { getFirstName } from "../utils";
import {
  AB_TRANSACTIONAL_EMAIL_IDS,
  TRANSACTIONAL_EMAIL_IDS,
} from "../constants";
import type { SupportRequest, ZendeskTicket, ZendeskUser } from "../types";

type Volunteer = Pick<
  Volunteers,
  "firstName" | "phone" | "registrationNumber" | "lastName" | "email"
>;

type Msr = Pick<ZendeskUser, "name" | "email"> &
  Pick<SupportRequest, "zendeskTicketId">;

export function getAbTransactionalEmailId(
  supportType: SupportRequest["supportType"]
): string {
  const randomNum = Math.random();

  if (randomNum <= 0.5) {
    return AB_TRANSACTIONAL_EMAIL_IDS[supportType]["a"];
  }

  return AB_TRANSACTIONAL_EMAIL_IDS[supportType]["b"];
}

export async function sendEmailToMsr(
  msr: Msr,
  volunteer: Volunteer,
  transactionalId: string
) {
  const emailVars = {
    msr_first_name: getFirstName(msr.name),
    volunteer_name: `${volunteer.firstName} ${volunteer.lastName}`,
    volunteer_phone: volunteer.phone,
    // Não consegui remover esse parâmetro do Loops, então preciamos enviar
    lawyer_phone: volunteer.phone,
    volunteer_registration_number: volunteer.registrationNumber,
    msr_zendesk_ticket_id: msr.zendeskTicketId.toString(),
  };

  const emailRes = await sendEmail(msr.email, transactionalId, emailVars);

  return emailRes;
}

export async function sendEmailToVolunteer(
  volunteer: Volunteer & { zendeskTicketId: ZendeskTicket["id"] },
  msrFirstName: Msr["name"],
  supportType: SupportRequest["supportType"]
) {
  const id = TRANSACTIONAL_EMAIL_IDS[supportType]["volunteer"];

  const emailVars = {
    volunteer_first_name: getFirstName(volunteer.firstName),
    msr_first_name: getFirstName(msrFirstName),
    volunteer_phone: volunteer.phone,
    volunteer_zendesk_ticket_id: volunteer.zendeskTicketId.toString(),
  };

  const emailRes = await sendEmail(volunteer.email, id, emailVars);

  return emailRes;
}

export async function sendEmailPublicService(
  msrEmail: string,
  msrFirstName: string,
  msrZendeskTicketId: string
): Promise<boolean> {
  const id = TRANSACTIONAL_EMAIL_IDS["publicService"];

  const emailVars = {
    msr_first_name: getFirstName(msrFirstName),
    msr_zendesk_ticket_id: msrZendeskTicketId,
  };

  const emailRes = await sendEmail(msrEmail, id, emailVars);

  return emailRes;
}

export async function sendEmailSocialWorker(
  msrEmail: string,
  msrFirstName: string,
  msrZendeskTicketId: string
): Promise<boolean> {
  const id = TRANSACTIONAL_EMAIL_IDS["socialWorker"];

  const emailVars = {
    msr_first_name: getFirstName(msrFirstName),
    msr_zendesk_ticket_id: msrZendeskTicketId,
  };

  const emailRes = await sendEmail(msrEmail, id, emailVars);

  return emailRes;
}
