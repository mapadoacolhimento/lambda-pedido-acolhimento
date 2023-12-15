import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, string, mixed, number, boolean, array } from "yup";
import { SupportType, SupportRequestsStatus } from "@prisma/client";

import prismaClient from "./prismaClient";
import { getErrorMessage, isJsonString, normalizeCity } from "./utils";

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
  }).required(),
)
  .required()
  .min(1)
  .strict();

const create = async (
  event: APIGatewayEvent,
  _context: Context,
  callback: APIGatewayProxyCallback,
) => {
  try {
    // console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    // console.log(`Context: ${JSON.stringify(context, null, 2)}`);

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

    const validatedBody = await bodySchema.validate(parsedBody);

    const supportRequestPromises = validatedBody.map(
      async (supportRequest) =>
        await prismaClient.supportRequests.create({
          data: {
            ...supportRequest,
            city: normalizeCity(supportRequest.city),
            SupportRequestStatusHistory: {
              create: {
                status: supportRequest.status,
              },
            },
          },
        }),
    );

    const supportRequests = await Promise.all(supportRequestPromises);
    const res = supportRequests.map((request) => ({
      ...request,
      msrId: request.msrId.toString(),
      zendeskTicketId: request.zendeskTicketId.toString(),
    }));

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: res,
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

export default create;
