import {
  MatchStage,
  MatchType,
  type VolunteerAvailability,
} from "@prisma/client";
import {
  getExpandedVolunteer,
  getIdealVolunteer,
  getOnlineVolunteer,
} from "./getVolunteer";
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
