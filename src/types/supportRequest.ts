import type { SupportType } from "@prisma/client";

export type SupportRequest = {
  supportRequestId: number;
  msrId: bigint;
  zendeskTicketId: bigint;
  supportType: SupportType;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
};
