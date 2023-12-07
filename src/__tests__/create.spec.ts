import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import type { Decimal } from "@prisma/client/runtime/library";
import create from "../create";
import { prismaMock } from "../setupTests";

describe("/create endpoint", () => {
  it("should return an error res when no body is provided to the req", async () => {
    const callback = jest.fn();
    await create(
      {
        body: null,
      } as APIGatewayProxyEvent,
      {} as Context,
      callback,
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
    await create(
      {
        body: JSON.stringify([
          {
            msrId: null,
          },
        ]),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback,
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
    await create(
      {
        body: JSON.stringify(body),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: "false",
      }),
    });
  });

  it("should return successful res when prisma validation and prisma req work", async () => {
    const callback = jest.fn();
    const defaultBody = {
      supportExpertise: null,
      priority: null,
      hasDisability: false,
      requiresLibras: false,
      acceptsOnlineSupport: true,
      lat: -11.23 as unknown as Decimal,
      lng: 23.32 as unknown as Decimal,
      city: "SÃO PAULO",
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
    prismaMock.supportRequests.create.mockResolvedValueOnce(
      mockPsySupportRequest,
    );
    prismaMock.supportRequests.create.mockResolvedValueOnce(
      mockLegalSupportRequest,
    );
    await create(
      {
        body: JSON.stringify([psySupportRequest, legalSupportRequest]),
      } as APIGatewayProxyEvent,
      {} as Context,
      callback,
    );
    const expectedRes = [mockPsySupportRequest, mockLegalSupportRequest].map(
      (m) => ({
        ...m,
        msrId: m.msrId.toString(),
        zendeskTicketId: m.zendeskTicketId.toString(),
      }),
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: expectedRes,
      }),
    });
  });
});
