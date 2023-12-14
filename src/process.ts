import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, number } from "yup";
import client from "./client";
import {
  getErrorMessage,
  isJsonString,
  createIdealMatch,
  createExpandedMatch,
  createOnlineMatch,
  decideOnOnlineMatch,
} from "./utils";
import { directToPublicService } from "./utils/match/publicService";
import { stringfyBigInt } from "./utils/stringfyBigInt";
import { createSupportRequestSchema } from "./utils/validations";
import type { SupportType, VolunteerAvailability } from "@prisma/client";

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

    const supportRequest = await bodySchema.validate(parsedBody);

    const allVolunteers: VolunteerAvailability[] = await fetchVolunteers(
      supportRequest.supportType
    );

    const idealMatch = await createIdealMatch(supportRequest, allVolunteers);

    if (idealMatch)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Support request ${supportRequest.supportRequestId} received an Ideal Match`,
          match: stringfyBigInt(idealMatch),
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
          message: `Support request ${supportRequest.supportRequestId} received an Expanded Match`,
          match: stringfyBigInt(expandedMatch),
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
            message: `Support request ${supportRequest.supportRequestId} received an Online Match`,
            match: stringfyBigInt(onlineMatch),
          }),
        });
    }

    const publicService = await directToPublicService(
      supportRequest.supportRequestId
    );

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Support request ${publicService.supportRequestId} directed to Public Service`,
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
