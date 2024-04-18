import type { Volunteers } from "@prisma/client";
import { TRANSACTIONAL_EMAIL_IDS } from "../constants";
import {
  getErrorMessage,
  encrypt,
  saveEncryptedEmail,
  getFirstName,
} from "../utils";
import type { SupportRequest, ZendeskUser } from "../types";

type Volunteer = Pick<
  Volunteers,
  "firstName" | "phone" | "registrationNumber" | "last_name" | "email"
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
    volunteer_name: `${volunteer.firstName} ${volunteer.last_name}`,
    volunteer_phone: volunteer.phone,
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

export async function sendEmail(
  email: string,
  id: string,
  emailVars: Record<string, string>
): Promise<boolean> {
  try {
    const endpoint = "https://app.loops.so/api/v1/transactional";
    const apiKey = process.env["LOOPS_API_KEY"];
    const encryptedEmail = encrypt(email);
    void saveEncryptedEmail(email, encryptedEmail);

    const response = await fetch(endpoint, {
      body: JSON.stringify({
        email,
        transactionalId: id,
        dataVariables: {
          ...emailVars,
          msr_email_hash: encryptedEmail,
        },
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.status !== 201 || !response.ok) {
      throw new Error(response.statusText);
    }

    return response.ok;
  } catch (e) {
    console.error(
      `[sendEmail] - Something went wrong when sending an email to this email '${email}', with this transactionalId: '${id}': ${getErrorMessage(
        e
      )}`
    );
    return false;
  }
}
