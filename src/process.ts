import {
  VolunteerAvailability,
  SupportRequests,
  Matches,
  MatchType,
} from "@prisma/client";

import {
  decideOnRandomization,
  findExpandedMatch,
  findIdealMatch,
  findOnlineMatch,
} from "./match/matchLogic";
import directToPublicService, {
  PublicService,
} from "./match/directToPublicService";

import directToSocialWorker, {
  SocialWorker,
} from "./match/directToSocialWorker";

import { isFeatureFlagEnabled } from "./prismaClient";
import { fetchVolunteers, getErrorMessage, stringfyBigInt } from "./utils";
import {
  ONLINE_MATCH,
  SOCIAL_WORKER,
  SOCIAL_WORKER_FEATURE_FLAG,
} from "./constants";

async function getRandomReferral(
  supportRequest: SupportRequests,
  allVolunteers: VolunteerAvailability[],
  matchType: MatchType
) {
  const isSocialWorkerFlagEnabled = await isFeatureFlagEnabled(
    SOCIAL_WORKER_FEATURE_FLAG
  );
  const shouldForwardTo = decideOnRandomization(isSocialWorkerFlagEnabled);

  switch (shouldForwardTo) {
    case ONLINE_MATCH:
      return await findOnlineMatch(supportRequest, allVolunteers, matchType);

    case SOCIAL_WORKER:
      return await directToSocialWorker(supportRequest.supportRequestId);

    default:
      return await directToPublicService(supportRequest.supportRequestId);
  }
}

const process = async (
  supportRequest: SupportRequests,
  matchType: MatchType = MatchType.msr,
  shouldRandomize: boolean = true
): Promise<Matches | PublicService | SocialWorker | null> => {
  try {
    const allVolunteers: VolunteerAvailability[] =
      await fetchVolunteers(supportRequest);

    const idealMatch = await findIdealMatch(
      supportRequest,
      allVolunteers,
      matchType
    );

    if (idealMatch) return stringfyBigInt(idealMatch) as Matches;

    const expandedMatch = await findExpandedMatch(
      supportRequest,
      allVolunteers,
      matchType
    );

    if (expandedMatch) return stringfyBigInt(expandedMatch) as Matches;

    if (!shouldRandomize) {
      const onlineMatch = await findOnlineMatch(
        supportRequest,
        allVolunteers,
        matchType
      );
      if (onlineMatch) return stringfyBigInt(onlineMatch) as Matches;
      return null;
    }

    const randomReferralMatch = await getRandomReferral(
      supportRequest,
      allVolunteers,
      matchType
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

export default process;
