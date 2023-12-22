import type {
  MatchStage,
  MatchType,
  VolunteerAvailability,
} from "@prisma/client";
import client from "../prismaClient";
import type { SupportRequest } from "../types";
import createAndUpdateZendeskMatchTickets from "./createAndUpdateZendeskMatchTickets";

export async function createMatch(
  supportRequest: SupportRequest,
  volunteerAvailability: VolunteerAvailability,
  matchType: MatchType,
  matchStage: MatchStage
) {
  const volunteerZendeskTicketId = await createAndUpdateZendeskMatchTickets(
    supportRequest,
    volunteerAvailability
  );

  const match = await client.matches.create({
    data: {
      supportRequestId: supportRequest.supportRequestId,
      msrId: supportRequest.msrId,
      volunteerId: volunteerAvailability.volunteer_id,
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
    volunteerAvailability.current_matches,
    volunteerAvailability.max_matches
  );

  await client.volunteerAvailability.update({
    where: {
      volunteer_id: volunteerAvailability.volunteer_id,
    },
    data: {
      current_matches: volunteerAvailability.current_matches + 1,
      is_available: isVolunteerAvailable,
    },
  });

  if (!isVolunteerAvailable) {
    await client.volunteers.update({
      where: {
        id: volunteerAvailability.volunteer_id,
      },
      data: {
        condition: "totally_booked",
      },
    });

    await client.volunteerStatusHistory.create({
      data: {
        volunteer_id: volunteerAvailability.volunteer_id,
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
