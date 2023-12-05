import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";
import { object, string, mixed, number, boolean } from "yup";
import { SupportType, VolunteerAvailability } from "@prisma/client";
import client from "./client";
import {
  fetchVolunteerForIdealMatch,
  createMatch,
  getErrorMessage,
  isJsonString,
} from "./utils";

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
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);

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

    if (!!supportRequest.lat && !!supportRequest.lng) {
      const volunteerForIdealMatch = fetchVolunteerForIdealMatch(
        supportRequest.lat,
        supportRequest.lng,
        allVolunteers,
      );

      if (volunteerForIdealMatch) {
        const match = await createMatch(
          supportRequest,
          volunteerForIdealMatch,
          "msr",
          "ideal",
        );

        return callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: { matchId: match.matchId.toString() },
          }),
        });
      }
    }

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hello from process!",
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
