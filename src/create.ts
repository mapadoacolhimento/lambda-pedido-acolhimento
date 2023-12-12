import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, array } from "yup";

import client from "./client";
import { getErrorMessage, isJsonString } from "./utils";
import { createSupportRequestSchema } from "./utils/validations";

const bodySchema = array(object(createSupportRequestSchema).required())
  .required()
  .min(1)
  .strict();

const create = async (
  event: APIGatewayEvent,
  _context: Context,
  callback: APIGatewayProxyCallback
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
            SupportRequestStatusHistory: {
              create: {
                status: supportRequest.status,
              },
            },
          },
        })
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
