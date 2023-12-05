import type { VolunteerAvailability } from "@prisma/client";
import * as turf from "@turf/turf";

const IDEAL_MATCH_MAX_DISTANCE = 20;

export function fetchVolunteerForIdealMatch(
  msrLat: number,
  msrLng: number,
  volunteers: VolunteerAvailability[],
) {
  const volunteersWithLatLng = filterVolunteersWithLatLng(volunteers);

  const closestVolunteers = fetchClosestVolunteers(
    msrLat,
    msrLng,
    volunteersWithLatLng,
  );

  if (closestVolunteers.length === 0) return null;

  return closestVolunteers[0];
}

export function filterVolunteersWithLatLng(
  volunteers: VolunteerAvailability[],
): VolunteerAvailability[] {
  return volunteers.filter((volunteer) => !!volunteer.lat && !!volunteer.lng);
}

function fetchClosestVolunteers(
  msrLat: number,
  msrLng: number,
  volunteers: VolunteerAvailability[],
) {
  return volunteers
    .map((volunteer) => {
      const pointA = [msrLng, msrLat];
      const pointB = [Number(volunteer.lng), Number(volunteer.lat)];
      const distance = calcDistance(pointA, pointB);
      return {
        ...volunteer,
        distance,
      };
    })
    .filter(
      (volunteer) =>
        volunteer.distance && volunteer.distance <= IDEAL_MATCH_MAX_DISTANCE,
    )
    .sort((a, b) => Number(a.distance) - Number(b.distance));
}

function calcDistance(pointA: number[], pointB: number[]): number | null {
  const a: turf.Coord = turf.point(pointA);

  const b: turf.Coord = turf.point(pointB);

  return Number(turf.distance(a, b));
}
