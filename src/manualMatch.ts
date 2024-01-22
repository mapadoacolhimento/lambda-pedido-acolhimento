import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import client from "./prismaClient";
// import { createMatch, checkVolunteerAvailability } from "./match/createMatch";
// import type {  MatchStage,
//   MatchType
// } from "@prisma/client";

interface RequestBody {
  msrZendeskTicketId: number;
  volunteerEmail: string;
}

export default async function handler(
  event: APIGatewayEvent,
  _context: Context,
  callback: APIGatewayProxyCallback
) {
  try {
    const body = event.body;

    if (!body) {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: "Request body is required",
        }),
      });
    }

    const parsedBody: RequestBody = JSON.parse(body);

    const { msrZendeskTicketId, volunteerEmail } = parsedBody;

    if (!msrZendeskTicketId) {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: "Zendesk Ticket Id from MSR is required in the request body",
        }),
      });
    }

    if (!volunteerEmail) {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: "Volunteer email is required in the request body",
        }),
      });
    }

    // Buscar o supportRequest usando o ZendeskTicketId
    const supportRequest = await client.supportRequests.findUnique({
      where: { zendeskTicketId: msrZendeskTicketId },
    });

    if (!supportRequest) {
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          error: `SupportRequest not found for ZendeskTicketId ${msrZendeskTicketId}`,
        }),
      });
    }

    const volunteer = await client.volunteers.findFirst({
      where: { email: volunteerEmail },
    });

    if (!volunteer) {
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          error: `Volunteer not found for email ${volunteerEmail}`,
        }),
      });
    }

    // Buscar a volunteerAvailability usando o volunteer_id
    const volunteerAvailability = await client.volunteerAvailability.findUnique(
      {
        where: { volunteer_id: volunteer.id },
      }
    );

    if (volunteerAvailability) {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: "SUPPORT REQUEST",
          volunteerAvailability,
        }),
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
      }),
    });
  }
}
