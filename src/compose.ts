import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import {
  SupportType,
  SupportRequestsStatus,
  SupportRequests,
} from "@prisma/client";
import { object, array, string, mixed, number, boolean } from "yup";

import process from "./process";
import prismaClient, { isFeatureFlagEnabled } from "./prismaClient";
import {
  getErrorMessage,
  isJsonString,
  normalizeCity,
  stringfyBigInt,
} from "./utils";
import { MSR_TEST_ZENDESK_USER_ID, NEW_MATCH_FEATURE_FLAG } from "./constants";

const bodySchema = array(
  object({
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
  }).required()
)
  .required()
  .min(1)
  .strict();

const compose = async (
  event: APIGatewayEvent,
  _context: Context,
  callback: APIGatewayProxyCallback
) => {
  try {
    // console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    // console.log(`Context: ${JSON.stringify(context, null, 2)}`);

    const { body } = event;
    if (!body) {
      console.error("[compose] - [400]: Empty request body");

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

    const validatedSupportRequestsBody = (await bodySchema.validate(
      parsedBody
    )) as unknown as SupportRequests[];

    const supportRequestPromises = validatedSupportRequestsBody.map(
      async (supportRequest) => {
        const status =
          supportRequest.state === "INT" ? "closed" : supportRequest.status;

        return await prismaClient.supportRequests.create({
          data: {
            ...supportRequest,
            supportExpertise: "not_found",
            city: normalizeCity(supportRequest.city || "not_found"),
            status: status,
            SupportRequestStatusHistory: {
              create: {
                status: status,
              },
            },
          },
        });
      }
    );

    const supportRequests = await Promise.all(supportRequestPromises);
    const openSupportRequests = supportRequests.filter(
      (supportRequest) => supportRequest.status === "open"
    );

    let res;
    const isNewMatchEnabled = await isFeatureFlagEnabled(
      NEW_MATCH_FEATURE_FLAG
    );
    const isTestMsr =
      supportRequests.filter(
        (s) => s.msrId.toString() === MSR_TEST_ZENDESK_USER_ID
      ).length === supportRequests.length;

    const shouldCreateMatch = isNewMatchEnabled || isTestMsr;

    if (shouldCreateMatch && openSupportRequests.length > 0) {
      const results = [];
      for (const supportRequest of openSupportRequests) {
        const result = await process(supportRequest);
        results.push(result);
      }
      res = results;
    } else {
      res = supportRequests.map(stringfyBigInt);
    }

    const validRes = res.find(Boolean);
    if (!validRes) {
      const tickets = openSupportRequests
        .map((supportRequest) => supportRequest.zendeskTicketId.toString())
        .join(",");

      throw new Error(
        `Invalid res when creating support request or processing it for these tickets: '${tickets}'`
      );
    }

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

      console.error(`[compose] - [400]: ${errorMsg}`);

      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: errorMsg,
        }),
      });
    }

    const errorMsg = getErrorMessage(error);
    console.error(`[compose] - [500]: ${errorMsg}`);

    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: errorMsg }),
    });
  }
};

export default compose;
