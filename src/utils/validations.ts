import { SupportType, SupportRequestsStatus } from "@prisma/client";
import { string, mixed, number, boolean } from "yup";

export const createSupportRequestSchema = {
  msrId: number().required(),
  zendeskTicketId: number().required(),
  supportType: mixed<SupportType>()
    .oneOf(Object.values(SupportType))
    .required(),
  status: mixed<SupportRequestsStatus>()
    .oneOf(Object.values(SupportRequestsStatus))
    .required(),
  supportExpertise: string().nullable().defined(),
  priority: number().nullable().defined(),
  hasDisability: boolean().nullable().defined(),
  requiresLibras: boolean().nullable().defined(),
  acceptsOnlineSupport: boolean().required(),
  lat: number().nullable().defined(),
  lng: number().nullable().defined(),
  city: string().required(),
  state: string().required(),
};
