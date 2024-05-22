import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, string, mixed, number, boolean } from "yup";

import {
  SupportType,
  SupportRequestsStatus,
  SupportRequests,
  MatchType,
} from "@prisma/client";

import { getErrorMessage, isJsonString } from "./utils";
import process from "./process";

const bodySchema = object({
  supportRequest: object({
    supportRequestId: number().required(),
    msrId: number().required(),
    zendeskTicketId: number().required(),
    supportType: mixed<SupportType>()
      .oneOf(Object.values(SupportType))
      .required(),
    status: mixed<SupportRequestsStatus>()
      .oneOf(Object.values(SupportRequestsStatus))
      .required(),
    supportExpertise: string().nullable().defined(),
    priority: number().nullable().defined(),
    hasDisability: boolean().nullable().defined(),
    requiresLibras: boolean().nullable().defined(),
    acceptsOnlineSupport: boolean().required(),
    lat: number().nullable().defined(),
    lng: number().nullable().defined(),
    city: string().required(),
    state: string().required(),
  }),
  matchType: mixed<MatchType>().oneOf(Object.values(MatchType)).required(),
  shouldRandomize: boolean(),
})
  .required()
  .required()
  .strict();

const handler = async (
  event: APIGatewayEvent,
  _context: Context,
  callback: APIGatewayProxyCallback
) => {
  try {
    const { body } = event;
    if (!body) {
      console.error("[handle-match] - [400]: Empty request body");

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

    const validatedBody = await bodySchema.validate(parsedBody);

    const { supportRequest, matchType, shouldRandomize } = validatedBody;

    const res = await process(
      supportRequest as unknown as SupportRequests,
      matchType,
      shouldRandomize
    );

    if (!res)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `No volunteers available`,
        }),
      });

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: res,
      }),
    });
  } catch (e) {
    const error = e as Record<string, unknown>;
    if (error["name"] === "ValidationError") {
      const errorMsg = `Validation error: ${getErrorMessage(error)}`;

      console.error(`[handle-match] - [400]: ${errorMsg}`);

      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: errorMsg,
        }),
      });
    }

    const errorMsg = getErrorMessage(error);
    console.error(`[handle-match] - [500]: ${errorMsg}`);

    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: errorMsg }),
    });
  }
};

export default handler;
