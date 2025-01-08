import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import type { Matches } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

import * as process from "../process";
import * as prisma from "../prismaClient";
import { stringfyBigInt } from "../utils";
import { handleMatch } from "../../handler";

const mockProcess = jest.spyOn(process, "default");
const mockIsFeatureFlagEnabled = jest.spyOn(prisma, "isFeatureFlagEnabled");
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

describe("/handle-match endpoint", () => {
  it("should return an error res when no body is provided to the req", async () => {
    const callback = jest.fn();
    await handleMatch(
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
    await handleMatch(
      {
        body: JSON.stringify({
          supportRequest: {
            supportRequestId: null,
          },
          matchType: "msr",
          shouldRandomize: false,
        }),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: `Validation error: supportRequest.state is a required field`,
      }),
    });
  });

  describe("Successful req", () => {
    const callback = jest.fn();
    const defaultBody = {
      supportExpertise: "not_found",
      priority: null,
      hasDisability: false,
      requiresLibras: false,
      acceptsOnlineSupport: true,
      lat: -11.23 as unknown as Decimal,
      lng: 23.32 as unknown as Decimal,
      city: "São Paulo",
      state: "SP",
      status: "open",
    };
    const psySupportRequest = {
      ...defaultBody,
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 1,
      supportType: "psychological" as const,
    };

    it("should return a res with match payload when there are volunteers available", async () => {
      mockIsFeatureFlagEnabled.mockResolvedValueOnce(true);
      mockProcess.mockResolvedValueOnce(mockMatch);

      await handleMatch(
        {
          body: JSON.stringify({
            supportRequest: psySupportRequest,
            matchType: "msr",
            shouldRandomize: false,
          }),
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
