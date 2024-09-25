import type {
  MatchStage,
  MatchType,
  VolunteerAvailability,
} from "@prisma/client";
import client from "../prismaClient";
import createAndUpdateZendeskMatchTickets from "./createAndUpdateZendeskMatchTickets";
import type { SupportRequest } from "../types";
import updateUnavailableVolunteer from "./updateUnavailableVolunteer";

export async function createMatch(
  supportRequest: SupportRequest,
  volunteerAvailability: VolunteerAvailability,
  matchType: MatchType,
  matchStage: MatchStage
) {
  const match = await client.matches.create({
    data: {
      supportRequestId: supportRequest.supportRequestId,
      msrId: supportRequest.msrId,
      volunteerId: volunteerAvailability.volunteer_id,
      msrZendeskTicketId: supportRequest.zendeskTicketId,
      volunteerZendeskTicketId: null,
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
      updated_at: new Date().toISOString(),
    },
  });

  if (!isVolunteerAvailable)
    await updateUnavailableVolunteer(volunteerAvailability.volunteer_id);

  const volunteerZendeskTicketId = await createAndUpdateZendeskMatchTickets(
    supportRequest,
    volunteerAvailability["volunteer_id"]
  );

  await client.matches.update({
    where: {
      matchId: match.matchId,
    },
    data: {
      volunteerZendeskTicketId,
    },
  });

  await client.supportRequests.update({
    where: {
      supportRequestId: supportRequest.supportRequestId,
    },
    data: {
      status: "matched",
      updatedAt: new Date().toISOString(),
      SupportRequestStatusHistory: {
        create: {
          status: "matched",
        },
      },
    },
  });

  return match;
}

export function checkVolunteerAvailability(
  currentMatches: VolunteerAvailability["current_matches"],
  maxMatches: VolunteerAvailability["max_matches"]
) {
  const isVolunteerAvailable = currentMatches + 1 < maxMatches ? true : false;
  return isVolunteerAvailable;
}
