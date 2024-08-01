import type { SupportRequests } from "@prisma/client";

export type SupportRequestGeoreference = Pick<
  SupportRequests,
  "lat" | "lng" | "state" | "city"
>;
