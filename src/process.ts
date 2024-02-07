import type {
  SupportType,
  VolunteerAvailability,
  SupportRequests,
  Matches,
} from "@prisma/client";

import {
  createExpandedMatch,
  createIdealMatch,
  createOnlineMatch,
  decideOnRandomization,
} from "./match/matchLogic";
import directToPublicService, {
  PublicService,
} from "./match/directToPublicService";

import directToSocialWorker, {
  SocialWorker,
} from "./match/directToSocialWorker";

import client, { isFeatureFlagEnabled } from "./prismaClient";
import { getErrorMessage, stringfyBigInt } from "./utils";
import {
  ONLINE_MATCH,
  SOCIAL_WORKER,
  SOCIAL_WORKER_FEATURE_FLAG,
} from "./constants";

async function getRandomReferral(
  supportRequest: SupportRequests,
  allVolunteers: VolunteerAvailability[]
) {
  const isSocialWorkerFlagEnabled = await isFeatureFlagEnabled(
    SOCIAL_WORKER_FEATURE_FLAG
  );
  const shouldForwardTo = decideOnRandomization(isSocialWorkerFlagEnabled);

  switch (shouldForwardTo) {
    case ONLINE_MATCH:
      return await createOnlineMatch(supportRequest, allVolunteers);

    case SOCIAL_WORKER:
      return await directToSocialWorker(supportRequest.supportRequestId);

    default:
      return await directToPublicService(supportRequest.supportRequestId);
  }
}

const process = async (
  supportRequest: SupportRequests
): Promise<Matches | PublicService | SocialWorker | null> => {
  try {
    const allVolunteers: VolunteerAvailability[] = await fetchVolunteers(
      supportRequest.supportType
    );

    const idealMatch = await createIdealMatch(supportRequest, allVolunteers);

    if (idealMatch) return stringfyBigInt(idealMatch) as Matches;

    const expandedMatch = await createExpandedMatch(
      supportRequest,
      allVolunteers
    );

    if (expandedMatch) return stringfyBigInt(expandedMatch) as Matches;

    const randomReferralMatch = await getRandomReferral(
      supportRequest,
      allVolunteers
    );

    if (randomReferralMatch)
      return stringfyBigInt(randomReferralMatch) as
        | Matches
        | SocialWorker
        | PublicService;

    const publicService = await directToPublicService(
      supportRequest.supportRequestId
    );

    return stringfyBigInt(publicService) as PublicService;
  } catch (e) {
    console.error(
      `[process] - Something went wrong while processing this support request '${
        supportRequest.supportRequestId
      }': ${getErrorMessage(e)}`
    );
    return null;
  }
};

const fetchVolunteers = async (supportType: SupportType) => {
  const availableVolunteers: VolunteerAvailability[] =
    await client.volunteerAvailability.findMany({
      where: { is_available: true, support_type: supportType },
    });

  return availableVolunteers || [];
};

export default process;
