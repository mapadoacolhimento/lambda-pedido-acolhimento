import type { VolunteerAvailability } from "@prisma/client";
import {
  filterVolunteersInTheSameState,
  findClosestVolunteer,
  findVolunteerInTheSameCity,
} from "./matchLogic";
import { IDEAL_MATCH_MAX_DISTANCE } from "../constants";
import type { SupportRequestGeoreference } from "../types";

export function getIdealVolunteer(
  supportRequestGeoreference: SupportRequestGeoreference,
  availableVolunteers: VolunteerAvailability[]
): VolunteerAvailability | null {
  return findClosestVolunteer(
    supportRequestGeoreference.lat,
    supportRequestGeoreference.lng,
    availableVolunteers,
    IDEAL_MATCH_MAX_DISTANCE
  );
}

export function getExpandedVolunteer(
  supportRequestGeoreference: SupportRequestGeoreference,
  availableVolunteers: VolunteerAvailability[]
): VolunteerAvailability | null {
  return findVolunteerInTheSameCity(
    supportRequestGeoreference.city,
    supportRequestGeoreference.state,
    availableVolunteers
  );
}

export function getOnlineVolunteer(
  supportRequestGeoreference: SupportRequestGeoreference,
  availableVolunteers: VolunteerAvailability[]
): VolunteerAvailability | null {
  if (availableVolunteers.length === 0) return null;

  const volunteersInTheSameState = filterVolunteersInTheSameState(
    supportRequestGeoreference.state,
    availableVolunteers
  );

  if (volunteersInTheSameState.length > 0) {
    const closestVolunteerInTheSameState = findClosestVolunteer(
      supportRequestGeoreference.lat,
      supportRequestGeoreference.lng,
      volunteersInTheSameState,
      null
    );

    if (closestVolunteerInTheSameState) return closestVolunteerInTheSameState;
  }

  const closestVolunteer = findClosestVolunteer(
    supportRequestGeoreference.lat,
    supportRequestGeoreference.lng,
    availableVolunteers,
    null
  );

  if (closestVolunteer) return closestVolunteer;

  return availableVolunteers[0] || null;
}
