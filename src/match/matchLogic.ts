import {
  MatchStage,
  MatchType,
  type VolunteerAvailability,
} from "@prisma/client";
import * as turf from "@turf/turf";
import { createMatch } from "./createMatch";
import { IDEAL_MATCH_MAX_DISTANCE } from "../constants";
import type { SupportRequest } from "../types";
import { ONLINE_MATCH, PUBLIC_SERVICE, SOCIAL_WORKER } from "../constants";

export async function createIdealMatch(
  supportRequest: SupportRequest,
  allVolunteers: VolunteerAvailability[],
  matchType: MatchType
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
    matchType,
    MatchStage.ideal
  );

  return match;
}

export async function createExpandedMatch(
  supportRequest: SupportRequest,
  allVolunteers: VolunteerAvailability[],
  matchType: MatchType
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
    matchType,
    MatchStage.expanded
  );

  return match;
}

export async function createOnlineMatch(
  supportRequest: SupportRequest,
  allVolunteers: VolunteerAvailability[],
  matchType: MatchType
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
        matchType,
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
      matchType,
      MatchStage.online
    );

    return match;
  }

  const match = await createMatch(
    supportRequest,
    allVolunteers[0] as VolunteerAvailability,
    matchType,
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
  msrLat: SupportRequest["lat"],
  msrLng: SupportRequest["lng"],
  volunteers: VolunteerAvailability[],
  maxDistance: number | null
): VolunteerAvailability | null {
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

  if (!maxDistance) return closestVolunteers[0] || null;

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
  msrCity: SupportRequest["city"],
  msrState: SupportRequest["state"],
  volunteers: VolunteerAvailability[]
): VolunteerAvailability | null {
  if (msrCity === "not_found" || msrState === "not_found") return null;

  const volunteerInTheSameCity = volunteers.find(
    (volunteer) => volunteer.city === msrCity && volunteer.state === msrState
  );
  return volunteerInTheSameCity || null;
}

export function filterVolunteersInTheSameState(
  msrState: SupportRequest["state"],
  volunteers: VolunteerAvailability[]
) {
  if (msrState === "not_found") return [];

  return volunteers.filter((volunteer) => volunteer.state === msrState);
}

export function decideOnRandomization(
  isSocialWorkerFlagEnabled: boolean
): number {
  const randomNum = Math.random();

  const shouldReceiveAnOnlineMatch = isSocialWorkerFlagEnabled ? 1 / 3 : 1 / 2;
  const shouldDirectToPublicService = isSocialWorkerFlagEnabled ? 1 / 3 : 1;
  const shouldDirectToSocialWorker = isSocialWorkerFlagEnabled ? 1 / 3 : 0;

  if (randomNum <= shouldReceiveAnOnlineMatch) {
    return ONLINE_MATCH;
  }

  if (randomNum <= shouldDirectToPublicService + shouldDirectToSocialWorker) {
    return PUBLIC_SERVICE;
  }

  return SOCIAL_WORKER;
}
