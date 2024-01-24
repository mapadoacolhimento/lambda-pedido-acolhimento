import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import client from "./prismaClient";
import { createMatch, checkVolunteerAvailability } from "./match/createMatch";
import { isJsonString } from "./utils";

export default async function handler(
  event: APIGatewayEvent,
  _context: Context,
  callback: APIGatewayProxyCallback
) {
  try {
    const body = event.body;

    // Check if the request body exists
    if (!body) {
      const errorMessage = "Request body is required";
      console.error(errorMessage);
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

    const { msrZendeskTicketId, volunteerEmail } = (parsedBody || {}) as {
      msrZendeskTicketId?: number;
      volunteerEmail?: string;
    };

    if (!msrZendeskTicketId) {
      const errorMessage =
        "Zendesk Ticket Id from MSR is required in the request body";
      console.error(errorMessage);

      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: errorMessage,
        }),
      });
    }

    if (!volunteerEmail) {
      const errorMessage = "Volunteer email is required in the request body";
      console.error(errorMessage);

      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: errorMessage,
        }),
      });
    }

    // Fetch the supportRequest using ZendeskTicketId
    const supportRequest = await client.supportRequests.findUnique({
      where: { zendeskTicketId: msrZendeskTicketId },
    });

    if (!supportRequest) {
      const errorMessage = `SupportRequest not found for ZendeskTicketId ${msrZendeskTicketId}`;
      console.error(errorMessage);

      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          error: errorMessage,
        }),
      });
    }

    // Fetch the volunteer using email
    const volunteer = await client.volunteers.findFirst({
      where: { email: volunteerEmail },
    });

    if (!volunteer) {
      const errorMessage = `Volunteer not found for email ${volunteerEmail}`;
      console.error(errorMessage);

      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          error: errorMessage,
        }),
      });
    }

    const volunteerAvailability = await client.volunteerAvailability.findUnique(
      {
        where: { volunteer_id: volunteer.id },
      }
    );

    if (!volunteerAvailability) {
      const errorMessage = `VolunteerAvailability not found for volunteer_id ${volunteer.id}`;
      console.error(errorMessage);

      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          error: errorMessage,
        }),
      });
    }

    // Remover <------------------------
    // Check volunteer's availability
    const isVolunteerAvailable = checkVolunteerAvailability(
      volunteerAvailability.current_matches,
      volunteerAvailability.max_matches
    );

    if (isVolunteerAvailable) {
      const match = await createMatch(
        supportRequest,
        volunteerAvailability,
        "manual",
        "manual"
      );
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: "Match created successfully!",
          match,
        }),
      });
    } else {
      const errorMessage = "Volunteer is not available for a match";
      console.error(errorMessage);

      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: errorMessage,
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
