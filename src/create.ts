import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, string, mixed, number, boolean } from "yup";
import { SupportRequestsStatus, SupportType } from "@prisma/client";

// import client from "./client";
import { getErrorMessage, isJsonString } from "./utils";

const bodySchema = object({
  msr_id: number().required(),
  zendesk_ticket_id: number().required(),
  support_type: mixed<SupportType>()
    .oneOf(Object.values(SupportType))
    .required(),
  support_expertise: string().required(),
  priority: number().nullable(),
  has_disability: boolean().required(),
  requires_libras: boolean().required(),
  accepts_online_support: boolean().required(),
  lat: number().required(),
  lng: number().required(),
  city: string().required(),
  state: string().required(),
  status: mixed<SupportRequestsStatus>()
    .oneOf(Object.values(SupportRequestsStatus))
    .required(),
});

const create = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
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

    const validatedBody = await bodySchema.validate(parsedBody);

    // const supportRequest = await client.supportRequests.create({
    //   data: validatedBody,
    // });

    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: validatedBody,
      }),
    });
  } catch (e) {
    const error = e as Record<string, unknown>;
    if (error["name"] === "ValidationError") {
      return callback(null, {
        statusCode: 400,
        body: `Validation error: ${getErrorMessage(e)}`,
      });
    }
    return callback(null, {
      statusCode: 500,
      body: getErrorMessage(error),
    });
  }
};

export default create;
