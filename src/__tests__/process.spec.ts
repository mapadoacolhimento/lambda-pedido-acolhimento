import type { SupportRequests } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

import process from "../process";
import { prismaMock } from "../setupTests";
import { stringfyBigInt } from "../utils";
import * as fetchVolunteers from "../lib/fetchVolunteers";
import * as createAndUpdateZendeskMatchTickets from "../match/createAndUpdateZendeskMatchTickets";
import * as updateTicket from "../zendeskClient/updateTicket";
import * as getUser from "../zendeskClient/getUser";
import type { ZendeskTicket, ZendeskUser } from "../types";

const createAndUpdateZendeskMatchTicketsMock = jest.spyOn(
  createAndUpdateZendeskMatchTickets,
  "default"
);
createAndUpdateZendeskMatchTicketsMock.mockImplementation(() =>
  Promise.resolve(123123123 as unknown as bigint)
);

const updateTicketMock = jest.spyOn(updateTicket, "default");
const getUserMock = jest.spyOn(getUser, "default");

updateTicketMock.mockImplementation(() =>
  Promise.resolve({
    id: 123123123,
    encoded_id: "ABC-123",
  } as unknown as ZendeskTicket)
);

const mockFetchVolunteers = jest.spyOn(fetchVolunteers, "default");

describe("process", () => {
  it("should return an error res when prisma req fails", async () => {
    prismaMock.supportRequests.update.mockRejectedValue(false);
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
    } as unknown as SupportRequests;
    const res = await process(body);
    expect(res).toStrictEqual({
      supportRequestId: body.supportRequestId,
      supportType: body.supportType,
    });
  });

  it("should return successful res when support request is directed to queue", async () => {
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
    } as unknown as SupportRequests;
    const supportRequest = {
      ...body,
      msrId: BigInt(1),
      zendeskTicketId: BigInt(100),
      status: "waiting_for_match" as const,
      supportType: "psychological" as const,
      lat: -11.23 as unknown as Decimal,
      lng: 23.32 as unknown as Decimal,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    getUserMock.mockResolvedValueOnce({
      name: "Teste MSR",
      email: "test@email.com",
    } as ZendeskUser);
    prismaMock.supportRequests.update.mockResolvedValueOnce(supportRequest);
    mockFetchVolunteers.mockResolvedValueOnce([]);

    const res = await process(body, undefined, true);
    expect(res).toStrictEqual(stringfyBigInt(supportRequest));
  });

  it("should return successful res when support request receives an Ideal Match", async () => {
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
    } as unknown as SupportRequests;
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
    mockFetchVolunteers.mockResolvedValueOnce([volunteerAvailability]);

    prismaMock.matches.create.mockResolvedValueOnce(match);

    const res = await process(body);

    expect(res).toStrictEqual(stringfyBigInt(match));
  });

  it("should return successful res when support request receives an Expanded Match", async () => {
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
    } as unknown as SupportRequests;
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
    mockFetchVolunteers.mockResolvedValueOnce([volunteerAvailability]);

    prismaMock.matches.create.mockResolvedValueOnce(match);

    const res = await process(body);

    expect(res).toStrictEqual(stringfyBigInt(match));
  });

  it("should not direct to queue if shouldDirectToQueue flag is false, returning null", async () => {
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
    } as unknown as SupportRequests;
    const supportRequest = {
      ...body,
      msrId: BigInt(1),
      zendeskTicketId: BigInt(100),
      supportType: "psychological" as const,
      lat: -23.558012418890804 as unknown as Decimal,
      lng: -46.67788121534589 as unknown as Decimal,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    prismaMock.supportRequests.update.mockResolvedValueOnce(supportRequest);
    mockFetchVolunteers.mockResolvedValueOnce([]);
    const res = await process(body, undefined, false);

    expect(res).toStrictEqual({
      supportRequestId: body.supportRequestId,
      supportType: body.supportType,
    });
  });

  it("should not direct to queue if shouldDirectToQueue is not passed, returning null", async () => {
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
    } as unknown as SupportRequests;
    const supportRequest = {
      ...body,
      msrId: BigInt(1),
      zendeskTicketId: BigInt(100),
      supportType: "psychological" as const,
      lat: -23.558012418890804 as unknown as Decimal,
      lng: -46.67788121534589 as unknown as Decimal,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    prismaMock.supportRequests.update.mockResolvedValueOnce(supportRequest);
    mockFetchVolunteers.mockResolvedValueOnce([]);
    const res = await process(body);

    expect(res).toStrictEqual({
      supportRequestId: body.supportRequestId,
      supportType: body.supportType,
    });
  });

  it("should direct to queue when shouldRandomize flag is true and there are no volunteers available", async () => {
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
    } as unknown as SupportRequests;
    const supportRequest = {
      ...body,
      msrId: BigInt(1),
      zendeskTicketId: BigInt(100),
      status: "waiting_for_match" as const,
      supportType: "psychological" as const,
      lat: -23.558012418890804 as unknown as Decimal,
      lng: -46.67788121534589 as unknown as Decimal,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    getUserMock.mockResolvedValueOnce({
      name: "Teste MSR",
      email: "test@email.com",
    } as ZendeskUser);

    prismaMock.supportRequests.update.mockResolvedValueOnce(supportRequest);
    mockFetchVolunteers.mockResolvedValueOnce([]);
    const res = await process(body, undefined, true);

    expect(res).toStrictEqual(stringfyBigInt(supportRequest));
  });
});
