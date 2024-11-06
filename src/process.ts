import {
  VolunteerAvailability,
  SupportRequests,
  Matches,
  MatchType,
} from "@prisma/client";
import {
  createExpandedMatch,
  createIdealMatch,
  createOnlineMatch,
} from "./match/matchLogic";
import { fetchVolunteers } from "./lib";
import { getErrorMessage, stringfyBigInt } from "./utils";
import directToQueue, { Queue } from "./match/directToQueue";

const process = async (
  supportRequest: SupportRequests,
  matchType: MatchType = MatchType.msr,
  shouldDirectToQueue = false
): Promise<Matches | Queue | null> => {
  try {
    const allVolunteers: VolunteerAvailability[] =
      await fetchVolunteers(supportRequest);

    const idealMatch = await createIdealMatch(
      supportRequest,
      allVolunteers,
      matchType
    );

    if (idealMatch) return stringfyBigInt(idealMatch) as Matches;

    const expandedMatch = await createExpandedMatch(
      supportRequest,
      allVolunteers,
      matchType
    );

    if (expandedMatch) return stringfyBigInt(expandedMatch) as Matches;

    const onlineMatch = await createOnlineMatch(
      supportRequest,
      allVolunteers,
      matchType
    );
    if (onlineMatch) return stringfyBigInt(onlineMatch) as Matches;

    if (shouldDirectToQueue) {
      const supportRequestInQueue = await directToQueue(
        supportRequest.supportRequestId
      );
      return stringfyBigInt(supportRequestInQueue) as Queue;
    }

    return null;
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
