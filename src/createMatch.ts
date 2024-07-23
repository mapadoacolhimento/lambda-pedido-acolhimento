import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, number, string } from "yup";

import client from "./prismaClient";

import { getErrorMessage, isJsonString, stringfyBigInt } from "./utils";
import { createMatch } from "./match/createMatch";
import { MatchStage, MatchType } from "@prisma/client";

const bodySchema = object({
  supportRequestId: number().required(),
  volunteerId: number().required(),
  matchType: string().oneOf(Object.values(MatchType)).required(),
  matchStage: string().oneOf(Object.values(MatchStage)).required(),
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
      console.error(`[create-match] - [400]: ${errorMessage}`);

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

    const { supportRequestId, volunteerId, matchType, matchStage } =
      validatedBody;

    const supportRequest = await client.supportRequests.findUnique({
      where: { supportRequestId: supportRequestId },
    });

    if (!supportRequest) {
      const errorMessage = `support_request not found for support_request_id '${supportRequestId}'`;

      return callback(null, notFoundErrorPayload(errorMessage));
    }

    const volunteerAvailability = await client.volunteerAvailability.findUnique(
      {
        where: { volunteer_id: volunteerId },
      }
    );

    if (!volunteerAvailability) {
      const errorMessage = `volunteer_availability not found for volunteer_id '${volunteerId}'`;

      return callback(null, notFoundErrorPayload(errorMessage));
    }

    const match = await createMatch(
      supportRequest,
      volunteerAvailability,
      matchType,
      matchStage
    );

    const bodyRes = JSON.stringify({
      message: stringfyBigInt(match),
    });

    return callback(null, {
      statusCode: 200,
      body: bodyRes,
    });
  } catch (e) {
    const error = e as Record<string, unknown>;
    if (error["name"] === "ValidationError") {
      const errorMsg = `Validation error: ${getErrorMessage(error)}`;

      console.error(`[create-match] - [400]: ${errorMsg}`);

      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: errorMsg,
        }),
      });
    }

    const errorMsg = getErrorMessage(error);
    console.error(`[create-match] - [500]: ${errorMsg}`);

    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: errorMsg }),
    });
  }
}

function notFoundErrorPayload(errorMessage: string) {
  console.error(`[create-match] - [404]: ${errorMessage}`);

  return {
    statusCode: 404,
    body: JSON.stringify({
      error: errorMessage,
    }),
  };
}
