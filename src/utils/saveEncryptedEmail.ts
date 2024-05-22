import client from "../prismaClient";
import getErrorMessage from "./getErrorMessage";

export default async function saveEncryptedEmail(
  email: string,
  emailHash: string
) {
  try {
    const busaraHash = await client.busaraHashes.upsert({
      where: {
        msrEmail: email,
      },
      update: {
        hash: emailHash,
      },
      create: {
        msrEmail: email,
        hash: emailHash,
      },
    });
    return busaraHash;
  } catch (e) {
    console.error(
      `Something went wrong when trying to save email hash: ${getErrorMessage(
        e
      )}`
    );
    return null;
  }
}
