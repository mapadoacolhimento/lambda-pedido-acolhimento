import {
  MatchStage,
  MatchType,
  type VolunteerAvailability,
} from "@prisma/client";
import * as turf from "@turf/turf";
import {
  getExpandedVolunteer,
  getIdealVolunteer,
  getOnlineVolunteer,
} from "./volunteer";
import { createMatch } from "./createMatch";
import type { SupportRequest } from "../types";
import { ONLINE_MATCH, PUBLIC_SERVICE, SOCIAL_WORKER } from "../constants";

export async function createIdealMatch(
  supportRequest: SupportRequest,
  allVolunteers: VolunteerAvailability[],
  matchType: MatchType = "msr"
) {
  const idealVolunteer = getIdealVolunteer(supportRequest, allVolunteers);

  if (!idealVolunteer) return null;

  const match = await createMatch(
    supportRequest,
    idealVolunteer,
    matchType,
    MatchStage.ideal
  );

  return match;
}

export async function createExpandedMatch(
  supportRequest: SupportRequest,
  allVolunteers: VolunteerAvailability[],
  matchType: MatchType = "msr"
) {
  const expandedVolunteer = getExpandedVolunteer(supportRequest, allVolunteers);

  if (!expandedVolunteer) return null;

  const match = await createMatch(
    supportRequest,
    expandedVolunteer,
    matchType,
    MatchStage.expanded
  );

  return match;
}

export async function createOnlineMatch(
  supportRequest: SupportRequest,
  allVolunteers: VolunteerAvailability[],
  matchType: MatchType = "msr"
) {
  const onlineVolunteer = getOnlineVolunteer(supportRequest, allVolunteers);

  if (!onlineVolunteer) return null;

  const match = await createMatch(
    supportRequest,
    onlineVolunteer,
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

  const volunteersWithDistance = volunteersWithLatLng.map((volunteer) => {
    const pointA = [Number(msrLng), Number(msrLat)];
    const pointB = [Number(volunteer.lng), Number(volunteer.lat)];
    const distance = calcDistance(pointA, pointB);
    return {
      ...volunteer,
      distance,
    };
  });

  if (!maxDistance) {
    const closestVolunteers = volunteersWithDistance.sort(
      (a, b) => Number(a.distance) - Number(b.distance)
    );
    return closestVolunteers[0] || null;
  }

  const volunteersWithinDistance = volunteersWithDistance.filter(
    (volunteer) => volunteer.distance && volunteer.distance <= maxDistance
  );
  return volunteersWithinDistance[0] || null;
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
