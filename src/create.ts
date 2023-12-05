import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, string, mixed, number, boolean } from "yup";
import { SupportType } from "@prisma/client";

import client from "./client";
import { getErrorMessage, isJsonString } from "./utils";

const bodySchema = object({
  msrId: number().required(),
  zendeskTicketId: number().required(),
  supportType: mixed<SupportType>()
    .oneOf(Object.values(SupportType))
    .required(),
  supportExpertise: string().required(),
  priority: number().nullable().defined(),
  hasDisability: boolean().required(),
  requiresLibras: boolean().required(),
  acceptsOnlineSupport: boolean().required(),
  lat: number().required(),
  lng: number().required(),
  city: string().required(),
  state: string().required(),
}).strict();

const create = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
) => {
  try {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);

    const { body } = event;
    if (!body) {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: "Empty request body",
          Success: false,
        }),
      });
    }

    const parsedBody = isJsonString(body)
      ? (JSON.parse(body) as unknown)
      : (Object.create(null) as Record<string, unknown>);

    const validatedBody = await bodySchema.validate(parsedBody);

    const supportRequest = await client.supportRequests.create({
      data: {
        ...validatedBody,
        status: "open",
        SupportRequestStatusHistory: {
          create: {
            status: "open",
          },
        },
      },
    });

    const { msrId, zendeskTicketId, ...rest } = supportRequest;
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        Success: true,
        msrId: msrId.toString(),
        zendeskTicketId: zendeskTicketId.toString(),
        ...rest,
      }),
    });
  } catch (e) {
    const error = e as Record<string, unknown>;
    if (error["name"] === "ValidationError") {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: `Validation error: ${getErrorMessage(e)}`,
          Success: false,
        }),
      });
    }
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: getErrorMessage(error),
        Success: false,
      }),
    });
  }
};

export default create;
