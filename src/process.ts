import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, string, mixed, number, boolean } from "yup";
import { SupportType, VolunteerAvailability } from "@prisma/client";
import client from "./client";
import {
  getErrorMessage,
  isJsonString,
  createIdealMatch,
  createExpandedMatch,
  createOnlineMatch,
  decideOnOnlineMatch,
} from "./utils";
import { directToPublicService } from "./utils/match/publicService";

const bodySchema = object({
  supportRequestId: number().required(),
  msrId: number().required(),
  zendeskTicketId: number().required(),
  supportType: mixed<SupportType>()
    .oneOf(Object.values(SupportType))
    .required(),
  supportExpertise: string().nullable().defined(), // mudar no create
  priority: number().nullable().defined(),
  hasDisability: boolean().nullable().defined(), // mudar no create
  requiresLibras: boolean().nullable().defined(), // mudar no create
  acceptsOnlineSupport: boolean().required(),
  lat: number().nullable().defined(), // mudar no create
  lng: number().nullable().defined(), // mudar no create
  city: string().required(),
  state: string().required(),
}).strict();

const process = async (
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

    const supportRequest = await bodySchema.validate(parsedBody);

    const allVolunteers: VolunteerAvailability[] = await fetchVolunteers(
      supportRequest.supportType,
    );

    const idealMatch = await createIdealMatch(supportRequest, allVolunteers);

    if (idealMatch)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Support request ${supportRequest.supportRequestId} received an Ideal Match with match_id: ${idealMatch.matchId}`,
        }),
      });

    const expandedMatch = await createExpandedMatch(
      supportRequest,
      allVolunteers,
    );

    if (expandedMatch)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Support request ${supportRequest.supportRequestId} received an Expanded Match with match_id: ${expandedMatch.matchId}`,
        }),
      });

    const shouldReceiveAnOnlineMatch = decideOnOnlineMatch();

    if (shouldReceiveAnOnlineMatch) {
      const onlineMatch = await createOnlineMatch(
        supportRequest,
        allVolunteers,
      );

      if (onlineMatch)
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: `Support request ${supportRequest.supportRequestId} received an Online Match with match_id: ${onlineMatch.matchId}`,
          }),
        });
    }

    const publicService = await directToPublicService(
      supportRequest.supportRequestId,
    );

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Support request ${publicService.supportRequestId} directed to Public Service`,
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

const fetchVolunteers = async (supportType: SupportType) => {
  const availableVolunteers: VolunteerAvailability[] =
    await client.volunteerAvailability.findMany({
      where: { is_available: true, support_type: supportType },
    });

  return availableVolunteers;
};

export default process;
