import {
  MatchStage,
  MatchType,
  type VolunteerAvailability,
} from "@prisma/client";
import * as turf from "@turf/turf";
import { createMatch } from "./createMatch";
import { IDEAL_MATCH_MAX_DISTANCE } from "../utils/constants";
import type { SupportRequest } from "../types/supportRequest";

export async function createIdealMatch(
  supportRequest: SupportRequest,
  allVolunteers: VolunteerAvailability[]
) {
  const closestVolunteer = findClosestVolunteer(
    supportRequest.lat,
    supportRequest.lng,
    allVolunteers,
    IDEAL_MATCH_MAX_DISTANCE
  );

  if (!closestVolunteer) return null;

  const match = await createMatch(
    supportRequest,
    closestVolunteer,
    MatchType.msr,
    MatchStage.ideal
  );

  return match;
}

export async function createExpandedMatch(
  supportRequest: SupportRequest,
  allVolunteers: VolunteerAvailability[]
) {
  const volunteerInTheSameCity = findVolunteerInTheSameCity(
    supportRequest.city,
    supportRequest.state,
    allVolunteers
  );

  if (!volunteerInTheSameCity) return null;

  const match = await createMatch(
    supportRequest,
    volunteerInTheSameCity,
    MatchType.msr,
    MatchStage.expanded
  );

  return match;
}

export async function createOnlineMatch(
  supportRequest: SupportRequest,
  allVolunteers: VolunteerAvailability[]
) {
  if (allVolunteers.length === 0) return null;

  const volunteersInTheSameState = filterVolunteersInTheSameState(
    supportRequest.state,
    allVolunteers
  );

  if (volunteersInTheSameState.length > 0) {
    const closestVolunteerInTheSameState = findClosestVolunteer(
      supportRequest.lat,
      supportRequest.lng,
      volunteersInTheSameState,
      null
    );

    if (closestVolunteerInTheSameState) {
      const match = await createMatch(
        supportRequest,
        closestVolunteerInTheSameState,
        MatchType.msr,
        MatchStage.online
      );

      return match;
    }
  }

  const closestVolunteer = findClosestVolunteer(
    supportRequest.lat,
    supportRequest.lng,
    allVolunteers,
    null
  );

  if (closestVolunteer) {
    const match = await createMatch(
      supportRequest,
      closestVolunteer,
      MatchType.msr,
      MatchStage.online
    );

    return match;
  }

  const match = await createMatch(
    supportRequest,
    allVolunteers[0] as VolunteerAvailability,
    MatchType.msr,
    MatchStage.online
  );

  return match;
}

export function filterVolunteersWithLatLng(
  volunteers: VolunteerAvailability[]
): VolunteerAvailability[] {
  return volunteers.filter((volunteer) => !!volunteer.lat && !!volunteer.lng);
}

export function findClosestVolunteer(
  msrLat: number | null,
  msrLng: number | null,
  volunteers: VolunteerAvailability[],
  maxDistance: number | null
) {
  if (!msrLat || !msrLng) return null;

  const volunteersWithLatLng = filterVolunteersWithLatLng(volunteers);
  if (volunteersWithLatLng.length === 0) return null;

  const closestVolunteers = volunteersWithLatLng
    .map((volunteer) => {
      const pointA = [Number(msrLng), Number(msrLat)];
      const pointB = [Number(volunteer.lng), Number(volunteer.lat)];
      const distance = calcDistance(pointA, pointB);
      return {
        ...volunteer,
        distance,
      };
    })
    .sort((a, b) => Number(a.distance) - Number(b.distance));

  if (!maxDistance) return closestVolunteers[0];

  const closestVolunteer = closestVolunteers.find(
    (volunteer) => volunteer.distance && volunteer.distance <= maxDistance
  );
  return closestVolunteer || null;
}

export function calcDistance(
  pointA: number[],
  pointB: number[]
): number | null {
  const a: turf.Coord = turf.point(pointA);

  const b: turf.Coord = turf.point(pointB);

  const distance = turf.distance(a, b);

  return distance ? Number(distance) : null;
}

export function findVolunteerInTheSameCity(
  msrCity: string,
  msrState: string,
  volunteers: VolunteerAvailability[]
) {
  if (msrCity === "not_found" || msrState === "not_found") return null;

  return (
    volunteers.find(
      (volunteer) => volunteer.city === msrCity && volunteer.state === msrState
    ) || null
  );
}

export function filterVolunteersInTheSameState(
  msrState: string,
  volunteers: VolunteerAvailability[]
) {
  if (msrState === "not_found") return [];

  return volunteers.filter((volunteer) => volunteer.state === msrState);
}

export function decideOnOnlineMatch() {
  const randomNum = Math.floor(Math.random() * 100);

  const shouldReceiveAnOnlineMatch = randomNum % 2 === 0;

  return shouldReceiveAnOnlineMatch;
}
