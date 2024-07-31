import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import { prismaMock } from "../setupTests";
import { findVolunteer } from "../../handler";
import type { Decimal } from "@prisma/client/runtime/library";
import * as fetchVolunteers from "../lib/fetchVolunteers";
import { stringfyBigInt } from "../utils";

const validBody = {
  supportRequestId: 1,
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

const mockFetchVolunteers = jest.spyOn(fetchVolunteers, "default");

const mockVolunteers = [
  {
    volunteer_id: 1,
    current_matches: 0,
    max_matches: 2,
    is_available: true,
    support_type: "psychological" as const,
    support_expertise: "",
    offers_online_support: true,
    offers_libras_support: false,
    lat: -11.25 as unknown as Decimal,
    lng: 23.33 as unknown as Decimal,
    city: "SAO PAULO",
    state: "SP",
    updated_at: new Date(),
    created_at: new Date(),
  },
];

describe("/find-voluteer endpoint", () => {
  it("should return an error res when no body is provided to the req", async () => {
    const callback = jest.fn();
    await findVolunteer(
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
    await findVolunteer(
      {
        body: JSON.stringify({
          supportRequestId: "abc",
        }),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      body: JSON.stringify({
        error:
          'Validation error: supportRequestId must be a `number` type, but the final value was: `"abc"`.',
      }),
    });
  });

  it("should return an error res when support_request is not found", async () => {
    const callback = jest.fn();
    prismaMock.supportRequests.findUnique.mockResolvedValueOnce(null);

    await findVolunteer(
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
});

describe("Successful req", () => {
  const callback = jest.fn();

  it("should return a res with volunteer payload when volunteer was found", async () => {
    prismaMock.supportRequests.findUnique.mockResolvedValueOnce(
      mockSupportRequest
    );

    mockFetchVolunteers.mockResolvedValueOnce(mockVolunteers);

    await findVolunteer(
      {
        body: JSON.stringify(validBody),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: stringfyBigInt({
          volunteer: {
            ...mockVolunteers[0],
            distance: 2.47693287732883,
          },
          matchStage: "ideal",
        }),
      }),
    });
  });
});
