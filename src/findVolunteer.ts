import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, number } from "yup";

import client from "./prismaClient";

import {
  fetchVolunteers,
  getErrorMessage,
  isJsonString,
  notFoundErrorPayload,
  stringfyBigInt,
} from "./utils";
import type { VolunteerAvailability } from "@prisma/client";
import {
  findExpandedMatch,
  findIdealMatch,
  findOnlineMatch,
} from "./match/matchLogic";

const bodySchema = object({
  supportRequestId: number().required(),
})
  .required()
  .strict();

export default async function handler(
  event: APIGatewayEvent,
  _context: Context,
  callback: APIGatewayProxyCallback
) {
  try {
    const body = event.body;

    if (!body) {
      const errorMessage = "Empty request body";
      console.error(`[find-volunteer] - [400]: ${errorMessage}`);

      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: errorMessage,
        }),
      });
    }

    const parsedBody = isJsonString(body)
      ? (JSON.parse(body) as unknown)
      : (Object.create(null) as Record<string, unknown>);

    const validatedBody = await bodySchema.validate(parsedBody);

    const { supportRequestId } = validatedBody;

    const supportRequest = await client.supportRequests.findUnique({
      where: { supportRequestId: supportRequestId },
    });

    if (!supportRequest) {
      const errorMessage = `support_request not found for support_request_id '${supportRequestId}'`;

      return callback(
        null,
        notFoundErrorPayload("find-volunteer", errorMessage)
      );
    }

    const allVolunteers: VolunteerAvailability[] = await fetchVolunteers(
      supportRequest.supportType
    );

    const idealMatch = await findIdealMatch(
      supportRequest,
      allVolunteers,
      undefined,
      false
    );

    if (idealMatch)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: stringfyBigInt({
            volunteer: idealMatch,
            matchStage: "ideal",
          }),
        }),
      });

    const expandedMatch = await findExpandedMatch(
      supportRequest,
      allVolunteers,
      undefined,
      false
    );

    if (expandedMatch)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: stringfyBigInt({
            volunteer: expandedMatch,
            matchStage: "expanded",
          }),
        }),
      });

    const onlineMatch = await findOnlineMatch(
      supportRequest,
      allVolunteers,
      undefined,
      false
    );

    if (onlineMatch)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: stringfyBigInt({
            volunteer: onlineMatch,
            matchStage: "online",
          }),
        }),
      });

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `No volunteers available`,
      }),
    });
  } catch (e) {
    const error = e as Record<string, unknown>;
    if (error["name"] === "ValidationError") {
      const errorMsg = `Validation error: ${getErrorMessage(error)}`;

      console.error(`[find-volunteer] - [400]: ${errorMsg}`);

      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: errorMsg,
        }),
      });
    }

    const errorMsg = getErrorMessage(error);
    console.error(`[find-volunteer] - [500]: ${errorMsg}`);

    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: errorMsg }),
    });
  }
}
