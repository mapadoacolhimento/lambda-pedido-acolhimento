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
  decideOnOnlineMatch,
} from "./match/matchLogic";
import directToPublicService, {
  PublicService,
} from "./match/directToPublicService";

import directToSocialWorker, {
  SocialWorker,
} from "./match/directToSocialworker";


import client from "./prismaClient";
import { getErrorMessage, stringfyBigInt } from "./utils";
import { ONLINE_MATCH, SOCIAL_WORKER } from "./constants";


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

    const shouldForwardTo = decideOnOnlineMatch();

    switch (shouldForwardTo){
      case ONLINE_MATCH: 
        const onlineMatch = await createOnlineMatch(
          supportRequest,
         allVolunteers
        );
        if (onlineMatch) return stringfyBigInt(onlineMatch) as Matches;
      
       case SOCIAL_WORKER:
          const solcialWorker = await directToSocialWorker(supportRequest.supportRequestId)
          return stringfyBigInt(solcialWorker) as SocialWorker;
        }

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
