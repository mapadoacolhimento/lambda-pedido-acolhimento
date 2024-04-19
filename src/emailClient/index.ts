import type { Volunteers } from "@prisma/client";
import sendEmail from "./sendEmail";
import { getFirstName } from "../utils";
import { TRANSACTIONAL_EMAIL_IDS } from "../constants";
import type { SupportRequest, ZendeskUser } from "../types";

type Volunteer = Pick<
  Volunteers,
  "firstName" | "phone" | "registrationNumber" | "lastName" | "email"
>;

type Msr = Pick<ZendeskUser, "name" | "email">;

export async function sendEmailToMsr(
  msr: Msr,
  volunteer: Volunteer,
  supportType: SupportRequest["supportType"]
) {
  const id = TRANSACTIONAL_EMAIL_IDS[supportType]["msr"];

  const emailVars = {
    msr_first_name: getFirstName(msr.name),
    volunteer_name: `${volunteer.firstName} ${volunteer.lastName}`,
    volunteer_phone: volunteer.phone,
    // Não consegui remover esse parâmetro do Loops, então preciamos enviar
    lawyer_phone: volunteer.phone,
    volunteer_registration_number: volunteer.registrationNumber,
  };

  const emailRes = await sendEmail(msr.email, id, emailVars);

  return emailRes;
}

export async function sendEmailToVolunteer(
  volunteer: Volunteer,
  msrFirstName: Msr["name"],
  supportType: SupportRequest["supportType"]
) {
  const id = TRANSACTIONAL_EMAIL_IDS[supportType]["volunteer"];

  const emailVars = {
    volunteer_first_name: getFirstName(volunteer.firstName),
    msr_first_name: getFirstName(msrFirstName),
    volunteer_phone: volunteer.phone,
  };

  const emailRes = await sendEmail(volunteer.email, id, emailVars);

  return emailRes;
}

export async function sendEmailPublicService(
  msrEmail: string,
  msrFirstName: string
): Promise<boolean> {
  const id = TRANSACTIONAL_EMAIL_IDS["publicService"];

  const emailVars = {
    msr_first_name: getFirstName(msrFirstName),
  };

  const emailRes = await sendEmail(msrEmail, id, emailVars);

  return emailRes;
}

export async function sendEmailServiceWorker(
  msrEmail: string,
  msrFirstName: string
): Promise<boolean> {
  const id = TRANSACTIONAL_EMAIL_IDS["serviceWorker"];

  const emailVars = {
    msr_first_name: getFirstName(msrFirstName),
  };

  const emailRes = await sendEmail(msrEmail, id, emailVars);

  return emailRes;
}
