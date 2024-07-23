import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import { prismaMock } from "../setupTests";
import { createNewMatch } from "../../handler";
import type { Decimal } from "@prisma/client/runtime/library";
import * as createMatch from "../match/createMatch";
import { stringfyBigInt } from "../utils";
import type { Matches } from "@prisma/client";

const validBody = {
  supportRequestId: 1,
  volunteerId: 1,
  matchType: "daily",
  matchStage: "online",
};

const mockSupportRequest = {
  supportRequestId: 1,
  msrId: BigInt(1),
  zendeskTicketId: BigInt(1),
  supportExpertise: "not_found",
  priority: null,
  hasDisability: false,
  requiresLibras: false,
  acceptsOnlineSupport: true,
  lat: -11.23 as unknown as Decimal,
  lng: 23.32 as unknown as Decimal,
  city: "SAO PAULO",
  state: "SP",
  status: "open" as const,
  supportType: "psychological" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockVolunteerAvailability = {
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

const mockCreateMatch = jest.spyOn(createMatch, "createMatch");

const mockMatch = stringfyBigInt({
  matchId: 1,
  supportRequestId: 1,
  msrId: BigInt(1),
  volunteerId: 1,
  msrZendeskTicketId: BigInt(1),
  volunteerZendeskTicketId: BigInt(2),
  supportType: "psychological" as const,
  matchType: "msr" as const,
  matchStage: "online" as const,
  status: "waiting_contact" as const,
  updatedAt: new Date(),
  createdAt: new Date(),
}) as Matches;

describe("/create-match endpoint", () => {
  it("should return an error res when no body is provided to the req", async () => {
    const callback = jest.fn();
    await createNewMatch(
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
    await createNewMatch(
      {
        body: JSON.stringify({
          supportRequestId: 1,
        }),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: `Validation error: matchStage is a required field`,
      }),
    });
  });

  it("should return an error res when support_request is not found", async () => {
    const callback = jest.fn();
    prismaMock.supportRequests.findUnique.mockResolvedValueOnce(null);

    await createNewMatch(
      {
        body: JSON.stringify(validBody),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 404,
      body: JSON.stringify({
        error: `support_request not found for support_request_id '1'`,
      }),
    });
  });

  it("should return an error res when volunteer_availability is not found", async () => {
    const callback = jest.fn();
    prismaMock.supportRequests.findUnique.mockResolvedValueOnce(
      mockSupportRequest
    );
    prismaMock.volunteerAvailability.findUnique.mockResolvedValueOnce(null);

    await createNewMatch(
      {
        body: JSON.stringify(validBody),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 404,
      body: JSON.stringify({
        error: `volunteer_availability not found for volunteer_id '1'`,
      }),
    });
  });

  describe("Successful req", () => {
    const callback = jest.fn();

    it("should return a res with match payload when match was created", async () => {
      prismaMock.supportRequests.findUnique.mockResolvedValueOnce(
        mockSupportRequest
      );
      prismaMock.volunteerAvailability.findUnique.mockResolvedValueOnce(
        mockVolunteerAvailability
      );
      mockCreateMatch.mockResolvedValueOnce(mockMatch);

      await createNewMatch(
        {
          body: JSON.stringify(validBody),
        } as APIGatewayProxyEvent,
        {} as Context,
        callback
      );
      expect(callback).toHaveBeenCalledWith(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: mockMatch,
        }),
      });
    });
  });
});
