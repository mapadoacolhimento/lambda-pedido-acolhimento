import type {
  MatchStage,
  MatchType,
  SupportType,
  VolunteerAvailability,
} from "@prisma/client";
import client from "../../client";

export async function createMatch(
  supportRequest: {
    supportRequestId: number;
    msrId: number;
    zendeskTicketId: number;
    supportType: SupportType;
  },
  volunteer: VolunteerAvailability,
  matchType: MatchType,
  matchStage: MatchStage,
) {
  const volunteerZendeskTicketId = createVolunteerZendestTicket();

  const match = await client.matches.create({
    data: {
      supportRequestId: supportRequest.supportRequestId,
      msrId: supportRequest.msrId,
      volunteerId: volunteer.volunteer_id,
      msrZendeskTicketId: supportRequest.zendeskTicketId,
      volunteerZendeskTicketId,
      supportType: supportRequest.supportType,
      matchType: matchType,
      matchStage: matchStage,
      status: "waiting_contact",
      MatchStatusHistory: {
        create: {
          status: "waiting_contact",
        },
      },
    },
  });

  return match;
}

function createVolunteerZendestTicket() {
  const zendeskTicketId = 1;

  return zendeskTicketId;
}
