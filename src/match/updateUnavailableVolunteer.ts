import type { VolunteerAvailability } from "@prisma/client";
import client from "../prismaClient";
import { updateUser } from "../zendeskClient";
import type { ZendeskUser } from "../types";

export default async function updateUnavailableVolunteer(
  volunteerId: VolunteerAvailability["volunteer_id"]
) {
  const volunteer = await client.volunteers.update({
    where: {
      id: volunteerId,
    },
    data: {
      condition: "indisponivel_sem_vagas",
    },
  });

  await client.volunteerStatusHistory.create({
    data: {
      volunteer_id: volunteerId,
      status: "indisponivel_sem_vagas",
      created_at: new Date(),
    },
  });

  if (!volunteer || !volunteer.zendeskUserId)
    throw new Error("Couldn't fetch volunteer from db");

  const volunteerZendeskUser: Pick<ZendeskUser, "id" | "user_fields"> = {
    id: volunteer.zendeskUserId,
    user_fields: { condition: "indisponivel_sem_vagas" },
  };
  const updatedVolunteer = await updateUser(volunteerZendeskUser);

  if (!updatedVolunteer)
    throw new Error("Couldn't update volunteer Zendesk status");

  return updatedVolunteer;
}
