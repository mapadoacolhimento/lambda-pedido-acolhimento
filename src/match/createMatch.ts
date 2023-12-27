import type {
  MatchStage,
  MatchType,
  VolunteerAvailability,
} from "@prisma/client";
import client from "../prismaClient";
import createAndUpdateZendeskMatchTickets from "./createAndUpdateZendeskMatchTickets";
import type { SupportRequest } from "../types";

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
      matchType,
      matchStage,
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
        condition: "indisponivel_sem_vagas",
      },
    });

    await client.volunteerStatusHistory.create({
      data: {
        volunteer_id: volunteerAvailability.volunteer_id,
        status: "indisponivel_sem_vagas",
        created_at: new Date(),
      },
    });
  }

  return match;
}

export function checkVolunteerAvailability(
  currentMatches: VolunteerAvailability["current_matches"],
  maxMatches: VolunteerAvailability["max_matches"]
) {
  const isVolunteerAvailable = currentMatches + 1 < maxMatches ? true : false;
  return isVolunteerAvailable;
}
