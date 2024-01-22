import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";

interface RequestBody {
  msrZendeskTicketId: number;
  volunteerEmail: string;
}

export default function handler(
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

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
        msrZendeskTicketId: msrZendeskTicketId,
        volunteerEmail: volunteerEmail,
      }),
    });
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
