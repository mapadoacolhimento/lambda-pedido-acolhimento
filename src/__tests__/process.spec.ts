import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import process from "../process";
import type { Decimal } from "@prisma/client/runtime/library";
import { prismaMock } from "../setupTests";
import { stringfyBigInt } from "../utils";

describe("/process endpoint", () => {
  it("should return an error res when no body is provided to the req", async () => {
    const callback = jest.fn();
    await process(
      {
        body: null,
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: "Empty request body",
      }),
    });
  });

  it("should return an error res when req body is invalid", async () => {
    const callback = jest.fn();
    await process(
      {
        body: JSON.stringify({
          msrId: null,
        }),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: `Validation error: state is a required field`,
      }),
    });
  });

  it("should return an error res when prisma req fails", async () => {
    prismaMock.supportRequests.update.mockRejectedValue(false);
    const callback = jest.fn();
    const body = {
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 100,
      supportType: "psychological",
      supportExpertise: null,
      status: "open",
      priority: null,
      hasDisability: null,
      requiresLibras: null,
      acceptsOnlineSupport: true,
      lat: -23.557943555122392,
      lng: -46.67783830352818,
      city: "SAO PAULO",
      state: "SP",
    };
    await process(
      {
        body: JSON.stringify(body),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: "false",
      }),
    });
  });

  it("should return successful res when support request is directed to public service", async () => {
    const callback = jest.fn();
    const body = {
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 100,
      supportType: "psychological",
      supportExpertise: null,
      status: "open",
      priority: null,
      hasDisability: null,
      requiresLibras: null,
      acceptsOnlineSupport: true,
      lat: -11.23,
      lng: 23.32,
      city: "SAO PAULO",
      state: "SP",
    };
    const supportRequest = {
      ...body,
      msrId: BigInt(1),
      zendeskTicketId: BigInt(100),
      status: "public_service" as const,
      supportType: "psychological" as const,
      lat: -11.23 as unknown as Decimal,
      lng: 23.32 as unknown as Decimal,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    prismaMock.supportRequests.update.mockResolvedValueOnce(supportRequest);
    prismaMock.volunteerAvailability.findMany.mockResolvedValueOnce([]);

    await process(
      {
        body: JSON.stringify(body),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: stringfyBigInt(supportRequest),
      }),
    });
  });

  it("should return successful res when support request receives an Ideal Match", async () => {
    const callback = jest.fn();
    const body = {
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 100,
      supportType: "psychological",
      supportExpertise: null,
      status: "open",
      priority: null,
      hasDisability: null,
      requiresLibras: null,
      acceptsOnlineSupport: true,
      lat: -11.23,
      lng: 23.32,
      city: "SAO PAULO",
      state: "SP",
    };
    const supportRequest = {
      ...body,
      msrId: BigInt(1),
      zendeskTicketId: BigInt(100),
      status: "public_service" as const,
      supportType: "psychological" as const,
      lat: -11.23 as unknown as Decimal,
      lng: 23.32 as unknown as Decimal,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    const volunteerAvailability = {
      volunteer_id: 1,
      current_matches: 0,
      max_matches: 2,
      is_available: true,
      support_type: "psychological" as const,
      support_expertise: "",
      offers_online_support: true,
      offers_libras_support: false,
      lat: -11.3 as unknown as Decimal,
      lng: 23.4 as unknown as Decimal,
      city: "SAO PAULO",
      state: "SP",
      updated_at: new Date(),
      created_at: new Date(),
    };
    const match = {
      matchId: 1,
      supportRequestId: 1,
      msrId: BigInt(1),
      volunteerId: 1,
      msrZendeskTicketId: BigInt(1),
      volunteerZendeskTicketId: BigInt(2),
      supportType: "psychological" as const,
      matchType: "msr" as const,
      matchStage: "ideal" as const,
      status: "waiting_contact" as const,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    prismaMock.supportRequests.update.mockResolvedValueOnce(supportRequest);
    prismaMock.volunteerAvailability.findMany.mockResolvedValueOnce([
      volunteerAvailability,
    ]);
    prismaMock.matches.create.mockResolvedValueOnce(match);

    await process(
      {
        body: JSON.stringify(body),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: stringfyBigInt(match),
      }),
    });
  });

  it("should return successful res when support request receives an Expanded Match", async () => {
    const callback = jest.fn();
    const body = {
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 100,
      supportType: "psychological",
      supportExpertise: null,
      status: "open",
      priority: null,
      hasDisability: null,
      requiresLibras: null,
      acceptsOnlineSupport: true,
      lat: -11.23,
      lng: 23.32,
      city: "SAO PAULO",
      state: "SP",
    };
    const supportRequest = {
      ...body,
      msrId: BigInt(1),
      zendeskTicketId: BigInt(100),
      status: "public_service" as const,
      supportType: "psychological" as const,
      lat: -23.558012418890804 as unknown as Decimal,
      lng: -46.67788121534589 as unknown as Decimal,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    const volunteerAvailability = {
      volunteer_id: 1,
      current_matches: 0,
      max_matches: 2,
      is_available: true,
      support_type: "psychological" as const,
      support_expertise: "",
      offers_online_support: true,
      offers_libras_support: false,
      lat: -23.45581927562912 as unknown as Decimal,
      lng: -45.066556703531184 as unknown as Decimal,
      city: "SAO PAULO",
      state: "SP",
      updated_at: new Date(),
      created_at: new Date(),
    };
    const match = {
      matchId: 1,
      supportRequestId: 1,
      msrId: BigInt(1),
      volunteerId: 1,
      msrZendeskTicketId: BigInt(1),
      volunteerZendeskTicketId: BigInt(2),
      supportType: "psychological" as const,
      matchType: "msr" as const,
      matchStage: "expanded" as const,
      status: "waiting_contact" as const,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    prismaMock.supportRequests.update.mockResolvedValueOnce(supportRequest);
    prismaMock.volunteerAvailability.findMany.mockResolvedValueOnce([
      volunteerAvailability,
    ]);
    prismaMock.matches.create.mockResolvedValueOnce(match);

    await process(
      {
        body: JSON.stringify(body),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: stringfyBigInt(match),
      }),
    });
  });
});
