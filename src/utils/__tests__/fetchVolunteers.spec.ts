import type { Decimal } from "@prisma/client/runtime/library";
import fetchVolunteers from "../fetchVolunteers";
import { prismaMock } from "../../setupTests";

const supportRequest = {
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

const previouslyMatchedVolunteers = [
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
  {
    volunteer_id: 2,
    current_matches: 0,
    max_matches: 2,
    is_available: true,
    support_type: "psychological" as const,
    support_expertise: "",
    offers_online_support: true,
    offers_libras_support: false,
    lat: -10 as unknown as Decimal,
    lng: 22 as unknown as Decimal,
    city: "RECIFE",
    state: "PE",
    updated_at: new Date(),
    created_at: new Date(),
  },
];

const notPreviouslyMatchedVolunteers = [
  {
    volunteer_id: 3,
    current_matches: 0,
    max_matches: 2,
    is_available: true,
    support_type: "psychological" as const,
    support_expertise: "",
    offers_online_support: true,
    offers_libras_support: false,
    lat: -9 as unknown as Decimal,
    lng: 20 as unknown as Decimal,
    city: "UBATUBA",
    state: "SP",
    updated_at: new Date(),
    created_at: new Date(),
  },
  {
    volunteer_id: 4,
    current_matches: 0,
    max_matches: 2,
    is_available: true,
    support_type: "psychological" as const,
    support_expertise: "",
    offers_online_support: true,
    offers_libras_support: false,
    lat: -8 as unknown as Decimal,
    lng: 21 as unknown as Decimal,
    city: "RIO DE JANEIRO",
    state: "RJ",
    updated_at: new Date(),
    created_at: new Date(),
  },
];

const previousMatches = [
  {
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
  },
];

const previousMatchConfirmations = [
  {
    matchConfirmationId: 1,
    supportRequestId: 1,
    msrId: BigInt(1),
    volunteerId: 2,
    msrZendeskTicketId: BigInt(1),
    volunteerZendeskTicketId: BigInt(2),
    supportType: "psychological" as const,
    matchType: "msr" as const,
    matchStage: "ideal" as const,
    status: "confirmed" as const,
    matchId: 1,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

describe("fetchVolunteers", () => {
  it("should return all volunteers if none of the available volunteers was previously matched with support_request", async () => {
    prismaMock.matches.findMany.mockResolvedValueOnce(previousMatches);
    prismaMock.matchConfirmations.findMany.mockResolvedValueOnce(
      previousMatchConfirmations
    );
    prismaMock.volunteerAvailability.findMany.mockResolvedValueOnce(
      notPreviouslyMatchedVolunteers
    );

    const availableVolunteers = await fetchVolunteers(supportRequest);

    expect(availableVolunteers).toStrictEqual(notPreviouslyMatchedVolunteers);
  });

  it("should return an empty array if all available volunteers were previously matched with the support_request", async () => {
    prismaMock.matches.findMany.mockResolvedValueOnce(previousMatches);
    prismaMock.matchConfirmations.findMany.mockResolvedValueOnce(
      previousMatchConfirmations
    );
    prismaMock.volunteerAvailability.findMany.mockResolvedValueOnce(
      previouslyMatchedVolunteers
    );

    const availableVolunteers = await fetchVolunteers(supportRequest);

    expect(availableVolunteers).toStrictEqual([]);
  });

  it("should return only the volunteers who weren't previously matched with the support_request", async () => {
    prismaMock.matches.findMany.mockResolvedValueOnce(previousMatches);
    prismaMock.matchConfirmations.findMany.mockResolvedValueOnce(
      previousMatchConfirmations
    );
    prismaMock.volunteerAvailability.findMany.mockResolvedValueOnce([
      ...previouslyMatchedVolunteers,
      ...notPreviouslyMatchedVolunteers,
    ]);

    const availableVolunteers = await fetchVolunteers(supportRequest);

    expect(availableVolunteers).toStrictEqual(notPreviouslyMatchedVolunteers);
  });
});
