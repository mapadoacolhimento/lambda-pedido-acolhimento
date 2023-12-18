import type { SupportType } from "@prisma/client";

export type SupportRequest = {
  supportRequestId: number;
  msrId: number;
  zendeskTicketId: number;
  supportType: SupportType;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
};
