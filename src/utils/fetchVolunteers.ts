import type { SupportType, VolunteerAvailability } from "@prisma/client";
import client from "../prismaClient";

export default async function fetchVolunteers(supportType: SupportType) {
  const availableVolunteers: VolunteerAvailability[] =
    await client.volunteerAvailability.findMany({
      where: { is_available: true, support_type: supportType },
      orderBy: [
        {
          current_matches: "asc",
        },
        {
          updated_at: "desc",
        },
      ],
    });

  return availableVolunteers || [];
}
