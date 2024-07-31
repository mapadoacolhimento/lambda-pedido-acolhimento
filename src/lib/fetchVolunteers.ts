import type {
  MatchConfirmations,
  Matches,
  VolunteerAvailability,
} from "@prisma/client";
import client from "../prismaClient";
import type { SupportRequest } from "../types";

export default async function fetchVolunteers(supportRequest: SupportRequest) {
  const previousMatches: Matches[] =
    (await client.matches.findMany({
      where: {
        supportRequestId: supportRequest.supportRequestId,
      },
    })) || [];

  const previousMatchConfirmations: MatchConfirmations[] =
    (await client.matchConfirmations.findMany({
      where: {
        supportRequestId: supportRequest.supportRequestId,
      },
    })) || [];

  const previousVolunteers = [
    ...previousMatches.map((match) => match.volunteerId),
    ...previousMatchConfirmations.map((match) => match.volunteerId),
  ];

  const availableVolunteers: VolunteerAvailability[] =
    (await client.volunteerAvailability.findMany({
      where: {
        is_available: true,
        support_type: supportRequest.supportType,
      },
      orderBy: [
        {
          current_matches: "asc",
        },
        {
          updated_at: "desc",
        },
      ],
    })) || [];

  const newAvailableVolunteers = availableVolunteers.filter((volunteer) => {
    return !previousVolunteers.includes(volunteer.volunteer_id);
  });

  return newAvailableVolunteers || [];
}
