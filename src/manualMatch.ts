import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, number, string } from "yup";

import client from "./prismaClient";
import { createMatch } from "./match/createMatch";
import { getErrorMessage, isJsonString, stringfyBigInt } from "./utils";

const bodySchema = object({
  msrZendeskTicketId: number().required(),
  volunteerEmail: string().required(),
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

    // Check if the request body exists
    if (!body) {
      const errorMessage = "Empty request body";
      console.error(`[manual-match] - [400]: ${errorMessage}`);

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

    const { msrZendeskTicketId, volunteerEmail } = validatedBody;

    // Fetch the supportRequest using ZendeskTicketId
    const supportRequest = await client.supportRequests.findUnique({
      where: { zendeskTicketId: msrZendeskTicketId },
    });

    if (!supportRequest) {
      const errorMessage = `support_request not found for zendesk_ticket_id '${msrZendeskTicketId}'`;

      return callback(null, notFoundErrorPayload(errorMessage));
    }

    // Fetch the volunteer using email
    const volunteer = await client.volunteers.findFirst({
      where: { email: volunteerEmail },
    });

    if (!volunteer) {
      const errorMessage = `volunteer not found for email: '${volunteerEmail}'`;

      return callback(null, notFoundErrorPayload(errorMessage));
    }

    const volunteerAvailability = await client.volunteerAvailability.findUnique(
      {
        where: { volunteer_id: volunteer.id },
      }
    );

    if (!volunteerAvailability) {
      const errorMessage = `volunteer_availability not found for volunteer_id '${volunteer.id}'`;

      return callback(null, notFoundErrorPayload(errorMessage));
    }

    const match = await createMatch(
      supportRequest,
      volunteerAvailability,
      "manual",
      "manual"
    );

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: stringfyBigInt(match),
      }),
    });
  } catch (e) {
    const error = e as Record<string, unknown>;
    if (error["name"] === "ValidationError") {
      const errorMsg = `Validation error: ${getErrorMessage(error)}`;

      console.error(`[manual-match] - [400]: ${errorMsg}`);

      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: errorMsg,
        }),
      });
    }

    const errorMsg = getErrorMessage(error);
    console.error(`[manual-match] - [500]: ${errorMsg}`);

    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: errorMsg }),
    });
  }
}

function notFoundErrorPayload(errorMessage: string) {
  console.error(`[manual-match] - [404]: ${errorMessage}`);

  return {
    statusCode: 404,
    body: JSON.stringify({
      error: errorMessage,
    }),
  };
}
