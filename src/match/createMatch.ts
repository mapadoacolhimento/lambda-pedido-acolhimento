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

  await client.volunteerAvailability.update({
    where: {
      volunteer_id: volunteerAvailability.volunteer_id,
    },
    data: {
      current_matches: volunteerAvailability.current_matches + 1,
      updated_at: new Date().toISOString(),
    },
  });

  const shouldUpdateVolunteerStatus = checkUpdateVolunteerStatus(
    volunteerAvailability
  );

  if (shouldUpdateVolunteerStatus)
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

export function checkUpdateVolunteerStatus(
  volunteerAvailability: VolunteerAvailability
) {
  const isPreviouslyAvailable = volunteerAvailability.is_available;
  const currentMatches = volunteerAvailability.current_matches + 1;
  const maxMatches = volunteerAvailability.max_matches;

  const hasMoreThanMaxMatches = currentMatches >= maxMatches;

  if (isPreviouslyAvailable && hasMoreThanMaxMatches) return true;

  return false;
}
