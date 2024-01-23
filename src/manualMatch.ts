import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import client from "./prismaClient";
import { createMatch, checkVolunteerAvailability } from "./match/createMatch";

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

    // Check if the request body exists
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

    // Fetch the supportRequest using ZendeskTicketId
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

    // Fetch the volunteer using email
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

    const volunteerAvailability = await client.volunteerAvailability.findUnique(
      {
        where: { volunteer_id: volunteer.id },
      }
    );

    if (!volunteerAvailability) {
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          error: `VolunteerAvailability not found for volunteer_id ${volunteer.id}`,
        }),
      });
    }

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
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: "Volunteer is not available for a match",
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
