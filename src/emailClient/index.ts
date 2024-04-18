import { TRANSACTIONAL_EMAIL_IDS } from "../constants";
import {
  getErrorMessage,
  encrypt,
  saveEncryptedEmail,
  getFirstName,
} from "../utils";

export async function sendEmailPublicService(
  msrEmail: string,
  msrFirstName: string
): Promise<boolean> {
  const id = TRANSACTIONAL_EMAIL_IDS["PUBLIC_SERVICE"];

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
  const id = TRANSACTIONAL_EMAIL_IDS["SERVICE_WORKER"];

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
