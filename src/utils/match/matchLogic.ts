import {
  MatchStage,
  MatchType,
  type SupportType,
  type VolunteerAvailability,
} from "@prisma/client";
import * as turf from "@turf/turf";
import { createMatch } from "./createMatch";
import { IDEAL_MATCH_MAX_DISTANCE } from "../constants";

export async function createIdealMatch(
  supportRequest: {
    supportRequestId: number;
    msrId: number;
    zendeskTicketId: number;
    supportType: SupportType;
    lat: number | null;
    lng: number | null;
  },
  allVolunteers: VolunteerAvailability[],
) {
  const closestVolunteers = fetchClosestVolunteers(
    supportRequest.lat,
    supportRequest.lng,
    allVolunteers,
    IDEAL_MATCH_MAX_DISTANCE,
  );

  if (!closestVolunteers[0]) return null;

  const { match } = await createMatch(
    supportRequest,
    closestVolunteers[0],
    MatchType.msr,
    MatchStage.ideal,
  );

  return match;
}

export async function createExpandedMatch(
  supportRequest: {
    supportRequestId: number;
    msrId: number;
    zendeskTicketId: number;
    supportType: SupportType;
    city: string;
    state: string;
  },
  allVolunteers: VolunteerAvailability[],
) {
  const volunteerInTheSameCity = findVolunteerInTheSameCity(
    supportRequest.city,
    supportRequest.state,
    allVolunteers,
  );

  if (!volunteerInTheSameCity) return null;

  const { match } = await createMatch(
    supportRequest,
    volunteerInTheSameCity,
    MatchType.msr,
    MatchStage.expanded,
  );

  return match;
}

export async function createOnlineMatch(
  supportRequest: {
    supportRequestId: number;
    msrId: number;
    zendeskTicketId: number;
    supportType: SupportType;
    lat: number | null;
    lng: number | null;
    city: string;
    state: string;
  },
  allVolunteers: VolunteerAvailability[],
) {
  if (!allVolunteers[0]) return null;

  const volunteersInTheSameState = filterVolunteersInTheSameState(
    supportRequest.state,
    allVolunteers,
  );

  if (volunteersInTheSameState[0]) {
    const closestVolunteersInTheSameState = fetchClosestVolunteers(
      supportRequest.lat,
      supportRequest.lng,
      volunteersInTheSameState,
      null,
    );

    if (closestVolunteersInTheSameState[0]) {
      const { match } = await createMatch(
        supportRequest,
        closestVolunteersInTheSameState[0],
        MatchType.msr,
        MatchStage.online,
      );

      return match;
    }
  }

  const closestVolunteers = fetchClosestVolunteers(
    supportRequest.lat,
    supportRequest.lng,
    allVolunteers,
    null,
  );

  if (closestVolunteers[0]) {
    const { match } = await createMatch(
      supportRequest,
      closestVolunteers[0],
      MatchType.msr,
      MatchStage.online,
    );

    return match;
  }

  const { match } = await createMatch(
    supportRequest,
    allVolunteers[0],
    MatchType.msr,
    MatchStage.online,
  );

  return match;
}

function filterVolunteersWithLatLng(
  volunteers: VolunteerAvailability[],
): VolunteerAvailability[] {
  return volunteers.filter((volunteer) => !!volunteer.lat && !!volunteer.lng);
}

function fetchClosestVolunteers(
  msrLat: number | null,
  msrLng: number | null,
  volunteers: VolunteerAvailability[],
  maxDistance: number | null,
) {
  if (!msrLat || !msrLng) return [];

  const volunteersWithLatLng = filterVolunteersWithLatLng(volunteers);
  if (!volunteersWithLatLng[0]) return [];

  const closestVolunteers = volunteersWithLatLng
    .map((volunteer) => {
      const pointA = [msrLng, msrLat];
      const pointB = [Number(volunteer.lng), Number(volunteer.lat)];
      const distance = calcDistance(pointA, pointB);
      return {
        ...volunteer,
        distance,
      };
    })
    .sort((a, b) => Number(a.distance) - Number(b.distance));

  if (!maxDistance) return closestVolunteers;

  return closestVolunteers.filter(
    (volunteer) => volunteer.distance && volunteer.distance <= maxDistance,
  );
}

function calcDistance(pointA: number[], pointB: number[]): number | null {
  const a: turf.Coord = turf.point(pointA);

  const b: turf.Coord = turf.point(pointB);

  return Number(turf.distance(a, b));
}

function findVolunteerInTheSameCity(
  msrCity: string,
  msrState: string,
  volunteers: VolunteerAvailability[],
) {
  if (msrCity === "not_found" || msrState === "not_found") return null;

  return (
    volunteers.find(
      (volunteer) => volunteer.city === msrCity && volunteer.state === msrState,
    ) || null
  );
}

function filterVolunteersInTheSameState(
  msrState: string,
  volunteers: VolunteerAvailability[],
) {
  if (msrState === "not_found") return [];

  return volunteers.filter((volunteer) => volunteer.state === msrState);
}

export function decideOnOnlineMatch() {
  const randomNum = Math.floor(Math.random() * 100);

  const shouldReceiveAnOnlineMatch = randomNum % 2 === 0;

  return shouldReceiveAnOnlineMatch;
}
