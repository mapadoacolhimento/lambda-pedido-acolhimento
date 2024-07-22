/* eslint-disable @typescript-eslint/unbound-method */
import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import type { Matches, SupportRequests } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

import compose from "../compose";
import * as process from "../process";
import * as prisma from "../prismaClient";
import { prismaMock } from "../setupTests";
import { stringfyBigInt } from "../utils";

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
  matchStage: "ideal" as const,
  status: "waiting_contact" as const,
  updatedAt: new Date(),
  createdAt: new Date(),
}) as Matches;

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
        error:
          "Validation error: this must be a `array` type, but the final value was: `{}`.",
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
    const legalSupportRequest = {
      ...defaultBody,
      status: "open",
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
      status: "open" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should call prisma with correct support request payload", async () => {
      prismaMock.supportRequests.create.mockResolvedValueOnce(
        mockPsySupportRequest
      );
      prismaMock.supportRequests.create.mockResolvedValueOnce({
        ...mockLegalSupportRequest,
        status: "duplicated",
      });

      await compose(
        {
          body: JSON.stringify([
            psySupportRequest,
            {
              ...legalSupportRequest,
              status: "duplicated",
            },
          ]),
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
          status: "duplicated",
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
      beforeEach(() => {
        prismaMock.supportRequests.create.mockResolvedValueOnce(
          mockPsySupportRequest
        );
        prismaMock.supportRequests.create.mockResolvedValueOnce(
          mockLegalSupportRequest
        );
      });

      describe("enabled", () => {
        it("should return a res with match payload", async () => {
          mockIsFeatureFlagEnabled.mockResolvedValueOnce(true);
          mockProcess.mockResolvedValueOnce(mockMatch);
          mockProcess.mockResolvedValueOnce({
            ...mockMatch,
            supportType: "legal",
          });

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
                mockMatch,
                {
                  ...mockMatch,
                  supportType: "legal",
                },
              ],
            }),
          });
        });
      });

      describe("disabled", () => {
        it("should return a res with support request payload", async () => {
          mockIsFeatureFlagEnabled.mockResolvedValueOnce(false);
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

    describe("When there is a duplicated support request", () => {
      it("should not create a match", async () => {
        mockIsFeatureFlagEnabled.mockResolvedValueOnce(true);
        prismaMock.supportRequests.create.mockResolvedValueOnce({
          ...mockLegalSupportRequest,
          status: "duplicated",
        });

        await compose(
          {
            body: JSON.stringify([
              {
                ...legalSupportRequest,
                status: "duplicated",
              },
            ]),
          } as APIGatewayProxyEvent,
          {} as Context,
          callback
        );

        expect(callback).toHaveBeenCalledWith(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: [
              stringfyBigInt({
                ...mockLegalSupportRequest,
                status: "duplicated",
              }),
            ],
          }),
        });
      });
    });

    describe("When there are international support requests", () => {
      beforeEach(() => {
        mockIsFeatureFlagEnabled.mockResolvedValueOnce(true);
      });

      it("should create support request with 'closed' status because state is 'INT'", async () => {
        await compose(
          {
            body: JSON.stringify([
              {
                ...legalSupportRequest,
                state: "INT",
              },
              psySupportRequest,
            ]),
          } as APIGatewayProxyEvent,
          {} as Context,
          callback
        );

        expect(prismaMock.supportRequests.create).toHaveBeenNthCalledWith(1, {
          data: {
            ...legalSupportRequest,
            state: "INT",
            city: "SAO PAULO",
            status: "closed",
            SupportRequestStatusHistory: {
              create: {
                status: "closed",
              },
            },
          },
        });
      });

      it("should create match for valid support requests", async () => {
        mockProcess.mockResolvedValueOnce(mockMatch);
        prismaMock.supportRequests.create.mockResolvedValueOnce(
          mockPsySupportRequest
        );
        prismaMock.supportRequests.create.mockResolvedValueOnce({
          ...mockLegalSupportRequest,
          status: "closed",
          state: "INT",
        });

        await compose(
          {
            body: JSON.stringify([
              psySupportRequest,
              {
                ...legalSupportRequest,
                state: "INT",
              },
            ]),
          } as APIGatewayProxyEvent,
          {} as Context,
          callback
        );

        expect(callback).toHaveBeenCalledWith(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: [mockMatch],
          }),
        });
      });

      it("should return support request if there are only international requests in payload", async () => {
        const mockedSupportRequest = {
          ...mockPsySupportRequest,
          status: "closed",
          state: "INT",
        } as unknown as SupportRequests;
        prismaMock.supportRequests.create.mockResolvedValueOnce(
          mockedSupportRequest
        );

        await compose(
          {
            body: JSON.stringify([{ ...psySupportRequest, state: "INT" }]),
          } as APIGatewayProxyEvent,
          {} as Context,
          callback
        );

        expect(callback).toHaveBeenCalledWith(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: [stringfyBigInt(mockedSupportRequest)],
          }),
        });
      });
    });
  });
});
