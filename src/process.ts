import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, number } from "yup";
import type {
  SupportType,
  VolunteerAvailability,
  SupportRequests,
} from "@prisma/client";

import {
  createExpandedMatch,
  createIdealMatch,
  createOnlineMatch,
  decideOnOnlineMatch,
} from "./match/matchLogic";
import { directToPublicService } from "./match/publicService";

import client from "./prismaClient";
import {
  getErrorMessage,
  isJsonString,
  createSupportRequestSchema,
  stringfyBigInt,
} from "./utils";

const bodySchema = object({
  supportRequestId: number().required(),
  ...createSupportRequestSchema,
}).strict();

const process = async (
  event: APIGatewayEvent,
  _context: Context,
  callback: APIGatewayProxyCallback
) => {
  try {
    const { body } = event;
    if (!body) {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: "Empty request body",
        }),
      });
    }

    const parsedBody = isJsonString(body)
      ? (JSON.parse(body) as unknown)
      : (Object.create(null) as Record<string, unknown>);

    const supportRequest = (await bodySchema.validate(
      parsedBody
    )) as unknown as SupportRequests;

    const allVolunteers: VolunteerAvailability[] = await fetchVolunteers(
      supportRequest.supportType
    );

    const idealMatch = await createIdealMatch(supportRequest, allVolunteers);

    if (idealMatch)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: stringfyBigInt(idealMatch),
        }),
      });

    const expandedMatch = await createExpandedMatch(
      supportRequest,
      allVolunteers
    );

    if (expandedMatch)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: stringfyBigInt(expandedMatch),
        }),
      });

    const shouldReceiveAnOnlineMatch = decideOnOnlineMatch();

    if (shouldReceiveAnOnlineMatch) {
      const onlineMatch = await createOnlineMatch(
        supportRequest,
        allVolunteers
      );

      if (onlineMatch)
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: stringfyBigInt(onlineMatch),
          }),
        });
    }

    const publicService = await directToPublicService(
      supportRequest.supportRequestId
    );

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: stringfyBigInt(publicService),
      }),
    });
  } catch (e) {
    const error = e as Record<string, unknown>;
    if (error["name"] === "ValidationError") {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: `Validation error: ${getErrorMessage(e)}`,
        }),
      });
    }
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: getErrorMessage(error) }),
    });
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
