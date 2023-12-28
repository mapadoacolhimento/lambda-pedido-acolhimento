import type { SupportRequests } from "@prisma/client";

export type SupportRequest = Pick<
  SupportRequests,
  | "lat"
  | "lng"
  | "supportRequestId"
  | "msrId"
  | "zendeskTicketId"
  | "supportType"
  | "city"
  | "state"
>;
