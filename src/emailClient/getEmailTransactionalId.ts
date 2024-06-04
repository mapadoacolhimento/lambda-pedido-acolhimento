import { BUSARA_MSR_TRANSACTIONAL_EMAIL_IDS } from "../constants";
import type { SupportRequest } from "../types";

export function getEmailTransactionalId(
  supportType: SupportRequest["supportType"]
): string {
  const randomNum = Math.random();

  if (randomNum <= 0.5) {
    return BUSARA_MSR_TRANSACTIONAL_EMAIL_IDS[supportType]["a"];
  }

  return BUSARA_MSR_TRANSACTIONAL_EMAIL_IDS[supportType]["b"];
}
