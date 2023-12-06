import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, string, mixed, number, boolean, array } from "yup";
import { SupportType } from "@prisma/client";

import client from "./client";
import { getErrorMessage, isJsonString } from "./utils";

const bodySchema = array(
  object({
    msrId: number().required(),
    zendeskTicketId: number().required(),
    supportType: mixed<SupportType>()
      .oneOf(Object.values(SupportType))
      .required(),
    supportExpertise: string().nullable().defined(),
    priority: number().nullable().defined(),
    hasDisability: boolean().required(),
    requiresLibras: boolean().required(),
    acceptsOnlineSupport: boolean().required(),
    lat: number().required(),
    lng: number().required(),
    city: string().required(),
    state: string().required(),
  }).required(),
)
  .required()
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
        await client.supportRequests.create({
          data: {
            ...supportRequest,
            status: "open",
            SupportRequestStatusHistory: {
              create: {
                status: "open",
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
