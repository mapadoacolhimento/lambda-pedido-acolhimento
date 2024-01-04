/* eslint-disable @typescript-eslint/unbound-method */
import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import type { FeatureFlag, Matches } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

import compose from "../compose";
import * as process from "../process";
import { prismaMock } from "../setupTests";
import { stringfyBigInt } from "../utils";

const mockProcess = jest.spyOn(process, "default");
const mockMatch = stringfyBigInt({
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
}) as Matches;
mockProcess.mockImplementation(() => Promise.resolve(mockMatch));

describe("/compose endpoint", () => {
  it("should return an error res when no body is provided to the req", async () => {
    const callback = jest.fn();
    await compose(
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
    await compose(
      {
        body: JSON.stringify([
          {
            msrId: null,
          },
        ]),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: `Validation error: [0].state is a required field`,
      }),
    });
  });

  it("should return an error res when prisma req fails", async () => {
    prismaMock.supportRequests.create.mockRejectedValue(false);
    const callback = jest.fn();
    const body = [
      {
        msrId: 123123,
        zendeskTicketId: 123123,
        supportType: "psychological",
        supportExpertise: null,
        priority: null,
        hasDisability: false,
        requiresLibras: false,
        acceptsOnlineSupport: true,
        lat: -11.23,
        lng: 23.32,
        city: "SÃO PAULO",
        state: "SP",
        status: "open",
      },
    ];
    await compose(
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

  describe("Successful req", () => {
    const callback = jest.fn();
    const defaultBody = {
      supportExpertise: null,
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
    const legalSupportRequest = {
      ...defaultBody,
      status: "duplicated",
      supportRequestId: 2,
      msrId: 1,
      zendeskTicketId: 2,
      supportType: "legal" as const,
    };
    const mockPsySupportRequest = {
      ...psySupportRequest,
      msrId: BigInt(psySupportRequest.msrId),
      zendeskTicketId: BigInt(psySupportRequest.zendeskTicketId),
      status: "open" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockLegalSupportRequest = {
      ...legalSupportRequest,
      msrId: BigInt(legalSupportRequest.msrId),
      zendeskTicketId: BigInt(legalSupportRequest.zendeskTicketId),
      status: "duplicated" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      prismaMock.supportRequests.create.mockResolvedValueOnce(
        mockPsySupportRequest
      );
      prismaMock.supportRequests.create.mockResolvedValueOnce(
        mockLegalSupportRequest
      );
    });

    it("should call prisma with correct support request payload", async () => {
      await compose(
        {
          body: JSON.stringify([psySupportRequest, legalSupportRequest]),
        } as APIGatewayProxyEvent,
        {} as Context,
        callback
      );
      expect(prismaMock.supportRequests.create).toHaveBeenCalledTimes(2);
      expect(prismaMock.supportRequests.create).toHaveBeenNthCalledWith(1, {
        data: {
          ...psySupportRequest,
          city: "SAO PAULO",
          SupportRequestStatusHistory: {
            create: {
              status: "open",
            },
          },
        },
      });
      expect(prismaMock.supportRequests.create).toHaveBeenNthCalledWith(2, {
        data: {
          ...legalSupportRequest,
          city: "SAO PAULO",
          SupportRequestStatusHistory: {
            create: {
              status: "duplicated",
            },
          },
        },
      });
    });

    describe("When NOVO_MATCH feature flag is", () => {
      describe("enabled", () => {
        beforeEach(() => {
          prismaMock.featureFlag.findUnique.mockResolvedValueOnce({
            featureEnabled: true,
          } as FeatureFlag);
        });
        it("should return a res with match payload", async () => {
          await compose(
            {
              body: JSON.stringify([psySupportRequest, legalSupportRequest]),
            } as APIGatewayProxyEvent,
            {} as Context,
            callback
          );
          expect(callback).toHaveBeenCalledWith(null, {
            statusCode: 200,
            body: JSON.stringify({
              message: [mockMatch, mockMatch],
            }),
          });
        });
      });
      describe("disabled", () => {
        beforeEach(() => {
          prismaMock.featureFlag.findUnique.mockResolvedValueOnce({
            featureEnabled: false,
          } as FeatureFlag);
        });
        it("should return a res with support request payload", async () => {
          await compose(
            {
              body: JSON.stringify([psySupportRequest, legalSupportRequest]),
            } as APIGatewayProxyEvent,
            {} as Context,
            callback
          );
          expect(callback).toHaveBeenCalledWith(null, {
            statusCode: 200,
            body: JSON.stringify({
              message: [
                stringfyBigInt(mockPsySupportRequest),
                stringfyBigInt(mockLegalSupportRequest),
              ],
            }),
          });
        });
      });
    });
  });
});
