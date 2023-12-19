import type {
  MatchStage,
  MatchType,
  VolunteerAvailability,
} from "@prisma/client";
import client from "../prismaClient";
import type { SupportRequest } from "../types/supportRequest";

export async function createMatch(
  supportRequest: SupportRequest,
  volunteer: VolunteerAvailability,
  matchType: MatchType,
  matchStage: MatchStage
) {
  const volunteerZendeskTicketId = createVolunteerZendeskTicket();

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

  await client.supportRequests.update({
    where: {
      supportRequestId: supportRequest.supportRequestId,
    },
    data: {
      status: "matched",
      SupportRequestStatusHistory: {
        create: {
          status: "matched",
        },
      },
    },
  });

  const isVolunteerAvailable = checkVolunteerAvailability(
    volunteer.current_matches,
    volunteer.max_matches
  );

  await client.volunteerAvailability.update({
    where: {
      volunteer_id: volunteer.volunteer_id,
    },
    data: {
      current_matches: volunteer.current_matches + 1,
      is_available: isVolunteerAvailable,
    },
  });

  if (!isVolunteerAvailable) {
    await client.volunteers.update({
      where: {
        id: volunteer.volunteer_id,
      },
      data: {
        condition: "totally_booked",
      },
    });

    await client.volunteerStatusHistory.create({
      data: {
        volunteer_id: volunteer.volunteer_id,
        status: "totally_booked",
        created_at: new Date(),
      },
    });
  }

  return match;
}

export function checkVolunteerAvailability(
  currentMatches: number,
  maxMatches: number
) {
  const isVolunteerAvailable = currentMatches + 1 < maxMatches ? true : false;
  return isVolunteerAvailable;
}

function createVolunteerZendeskTicket() {
  const zendeskTicketId = 1;

  return zendeskTicketId;
}
