import type { VolunteerAvailability } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

import {
  decideOnRandomization,
  createIdealMatch,
  createExpandedMatch,
  createOnlineMatch,
} from "../matchLogic";
import { prismaMock } from "../../setupTests";
import * as createAndUpdateZendeskMatchTickets from "../createAndUpdateZendeskMatchTickets";
import * as createMatch from "../createMatch";

const createAndUpdateZendeskMatchTicketsMock = jest.spyOn(
  createAndUpdateZendeskMatchTickets,
  "default"
);
createAndUpdateZendeskMatchTicketsMock.mockImplementation(() =>
  Promise.resolve(123123123 as unknown as bigint)
);
const mockCreateMatch = jest.spyOn(createMatch, "createMatch");

const mockPsyVolunteerAvailability = {
  volunteer_id: 1,
  current_matches: 0,
  max_matches: 2,
  is_available: true,
  support_type: "psychological" as const,
  support_expertise: "",
  offers_online_support: true,
  offers_libras_support: false,
  lat: -23.0159503 as unknown as Decimal,
  lng: -45.5405232 as unknown as Decimal,
  city: "TAUBATE",
  state: "SP",
  updated_at: new Date("2023-01-01"),
  created_at: new Date("2023-01-01"),
};

describe("createIdealMatch()", () => {
  it("should return null if there are no volunteers within 20km", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1 as unknown as bigint,
      zendeskTicketId: 1 as unknown as bigint,
      supportType: "psychological" as const,
      lat: -23.556080048271628 as unknown as Decimal,
      lng: -46.679234876547184 as unknown as Decimal,
      city: "SAO PAULO",
      state: "SP",
    };

    const volunteerAvailability: VolunteerAvailability[] = [
      {
        volunteer_id: 2,
        current_matches: 0,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: -23.430293939517146 as unknown as Decimal,
        lng: -47.50959474771392 as unknown as Decimal,
        city: "UBATUBA",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const idealMatch = await createIdealMatch(
      supportRequest,
      volunteerAvailability,
      "msr"
    );

    expect(idealMatch).toStrictEqual(null);
  });

  it("should return an ideal match if there is a volunteer within 20km", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1 as unknown as bigint,
      zendeskTicketId: 1 as unknown as bigint,
      supportType: "psychological" as const,
      lat: -23.55603087428766 as unknown as Decimal,
      lng: -46.67928852072954 as unknown as Decimal,
      city: "SAO PAULO",
      state: "SP",
    };

    const volunteerAvailability: VolunteerAvailability[] = [
      {
        volunteer_id: 2,
        current_matches: 0,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: -23.54550321931439 as unknown as Decimal,
        lng: -46.64974495134868 as unknown as Decimal,
        city: "SAO PAULO",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

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
      updatedAt: new Date("2023-01-01"),
      createdAt: new Date("2023-01-01"),
    };

    prismaMock.matches.create.mockResolvedValueOnce(match);

    const idealMatch = await createIdealMatch(
      supportRequest,
      volunteerAvailability,
      "msr"
    );

    expect(idealMatch).toStrictEqual(match);
  });
});

describe("createExpandedMatch()", () => {
  it("should return null if there are no volunteers in the same city", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1 as unknown as bigint,
      zendeskTicketId: 1 as unknown as bigint,
      supportType: "psychological" as const,
      lat: null,
      lng: null,
      city: "SAO PAULO",
      state: "SP",
    };

    const volunteerAvailability: VolunteerAvailability[] = [
      {
        volunteer_id: 2,
        current_matches: 0,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: -23.430293939517146 as unknown as Decimal,
        lng: -47.50959474771392 as unknown as Decimal,
        city: "UBATUBA",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const expandedMatch = await createExpandedMatch(
      supportRequest,
      volunteerAvailability,
      "msr"
    );

    expect(expandedMatch).toStrictEqual(null);
  });

  it("should return an expanded match if there is a volunteer in the same city", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1 as unknown as bigint,
      zendeskTicketId: 1 as unknown as bigint,
      supportType: "psychological" as const,
      city: "SAO PAULO",
      state: "SP",
      lat: null,
      lng: null,
    };

    const volunteerAvailability: VolunteerAvailability[] = [
      {
        volunteer_id: 2,
        current_matches: 0,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: -23.603193163278828 as unknown as Decimal,
        lng: -46.39968812227218 as unknown as Decimal,
        city: "SAO PAULO",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

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
      updatedAt: new Date("2023-01-01"),
      createdAt: new Date("2023-01-01"),
    };

    prismaMock.matches.create.mockResolvedValueOnce(match);

    const expandedMatch = await createExpandedMatch(
      supportRequest,
      volunteerAvailability,
      "msr"
    );

    expect(expandedMatch).toStrictEqual(match);
  });
});

describe("createOnlineMatch()", () => {
  it("should return null if there are no volunteers available", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1 as unknown as bigint,
      zendeskTicketId: 1 as unknown as bigint,
      supportType: "psychological" as const,
      lat: -23.556148891818268 as unknown as Decimal,
      lng: -46.67917050352835 as unknown as Decimal,
      city: "SAO PAULO",
      state: "SP",
    };

    const volunteerAvailability: VolunteerAvailability[] = [];

    const onlineMatch = await createOnlineMatch(
      supportRequest,
      volunteerAvailability,
      "msr"
    );

    expect(onlineMatch).toStrictEqual(null);
  });

  it("should return an online match if there are volunteers available", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1 as unknown as bigint,
      zendeskTicketId: 1 as unknown as bigint,
      supportType: "psychological" as const,
      lat: -23.556148891818268 as unknown as Decimal,
      lng: -46.67917050352835 as unknown as Decimal,
      city: "SAO PAULO",
      state: "SP",
    };

    const volunteerAvailability: VolunteerAvailability[] = [
      {
        volunteer_id: 2,
        current_matches: 0,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: -23.603193163278828 as unknown as Decimal,
        lng: -46.39968812227218 as unknown as Decimal,
        city: "SAO PAULO",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const match = {
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
      updatedAt: new Date("2023-01-01"),
      createdAt: new Date("2023-01-01"),
    };

    prismaMock.matches.create.mockResolvedValueOnce(match);

    const onlineMatch = await createOnlineMatch(
      supportRequest,
      volunteerAvailability,
      "msr"
    );

    expect(onlineMatch).toStrictEqual(match);
  });

  it("should return a match with the closest volunteer in the state if there are volunteers available in the same state", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1 as unknown as bigint,
      zendeskTicketId: 1 as unknown as bigint,
      supportType: "psychological" as const,
      lat: -23.556148891818268 as unknown as Decimal,
      lng: -46.67917050352835 as unknown as Decimal,
      city: "SAO PAULO",
      state: "SP",
    };
    const volunteerAvailability = [
      {
        ...mockPsyVolunteerAvailability,
        volunteer_id: 1,
        lat: -23.0159503 as unknown as Decimal,
        lng: -45.5405232 as unknown as Decimal,
        city: "TAUBATE",
        state: "SP",
      },
      {
        ...mockPsyVolunteerAvailability,
        volunteer_id: 2,
        lat: -23.4568386 as unknown as Decimal,
        lng: -45.0682371 as unknown as Decimal,
        city: "UBATUBA",
        state: "SP",
      },
    ];

    const matchWithClosestVolunteer = {
      matchId: 1,
      supportRequestId: 1,
      msrId: BigInt(1),
      volunteerId: 1,
      msrZendeskTicketId: BigInt(1),
      volunteerZendeskTicketId: BigInt(2),
      supportType: "legal" as const,
      matchType: "msr" as const,
      matchStage: "online" as const,
      status: "waiting_contact" as const,
      updatedAt: new Date("2023-01-01"),
      createdAt: new Date("2023-01-01"),
    };

    prismaMock.matches.create.mockResolvedValueOnce(matchWithClosestVolunteer);

    const onlineMatch = await createOnlineMatch(
      supportRequest,
      volunteerAvailability,
      "msr"
    );

    expect(mockCreateMatch).toHaveBeenNthCalledWith(
      1,
      supportRequest,
      {
        ...volunteerAvailability[0],
        distance: 130.89389643837765,
      },
      "msr",
      "online"
    );
    expect(onlineMatch).toStrictEqual(matchWithClosestVolunteer);
  });

  it("should return a match with the closest volunteer if there are NO volunteers available in the same state", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1 as unknown as bigint,
      zendeskTicketId: 1 as unknown as bigint,
      supportType: "legal" as const,
      lat: -23.556148891818268 as unknown as Decimal,
      lng: -46.67917050352835 as unknown as Decimal,
      city: "SAO PAULO",
      state: "SP",
    };
    const volunteerAvailability = [
      {
        ...mockPsyVolunteerAvailability,
        lat: null,
        lng: null,
        support_type: "legal",
        volunteer_id: 2,
      },
      {
        ...mockPsyVolunteerAvailability,
        lat: null,
        lng: null,
        volunteer_id: 1,
        support_type: "legal",
      },
    ];

    const matchWithClosestVolunteer = {
      matchId: 1,
      supportRequestId: 1,
      msrId: BigInt(1),
      volunteerId: 2,
      msrZendeskTicketId: BigInt(1),
      volunteerZendeskTicketId: BigInt(2),
      supportType: "legal" as const,
      matchType: "msr" as const,
      matchStage: "online" as const,
      status: "waiting_contact" as const,
      updatedAt: new Date("2023-01-01"),
      createdAt: new Date("2023-01-01"),
    };

    prismaMock.matches.create.mockResolvedValueOnce(matchWithClosestVolunteer);

    const onlineMatch = await createOnlineMatch(
      supportRequest,
      volunteerAvailability,
      "msr"
    );

    expect(mockCreateMatch).toHaveBeenNthCalledWith(
      1,
      supportRequest,
      volunteerAvailability[0],
      "msr",
      "online"
    );
    expect(onlineMatch).toStrictEqual(matchWithClosestVolunteer);
  });

  it("should return any volunteer if none have lat/lng info", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1 as unknown as bigint,
      zendeskTicketId: 1 as unknown as bigint,
      supportType: "legal" as const,
      lat: -23.556148891818268 as unknown as Decimal,
      lng: -46.67917050352835 as unknown as Decimal,
      city: "SAO PAULO",
      state: "SP",
    };
    const volunteerAvailability = [
      {
        ...mockPsyVolunteerAvailability,
        volunteer_id: 1,
        support_type: "legal",
        city: "BELO HORIZONTE",
        state: "MG",
      } as VolunteerAvailability,
      {
        ...mockPsyVolunteerAvailability,
        support_type: "legal",
        volunteer_id: 2,
        city: "MANAUS",
        state: "AM",
      } as VolunteerAvailability,
    ];

    const matchWithClosestVolunteer = {
      matchId: 1,
      supportRequestId: 1,
      msrId: BigInt(1),
      volunteerId: 2,
      msrZendeskTicketId: BigInt(1),
      volunteerZendeskTicketId: BigInt(2),
      supportType: "psychological" as const,
      matchType: "msr" as const,
      matchStage: "online" as const,
      status: "waiting_contact" as const,
      updatedAt: new Date("2023-01-01"),
      createdAt: new Date("2023-01-01"),
    };

    prismaMock.matches.create.mockResolvedValueOnce(matchWithClosestVolunteer);

    const onlineMatch = await createOnlineMatch(
      supportRequest,
      volunteerAvailability,
      "msr"
    );

    expect(mockCreateMatch).toHaveBeenNthCalledWith(
      1,
      supportRequest,
      {
        ...volunteerAvailability[0],
        distance: 130.89389643837765,
      },
      "msr",
      "online"
    );
    expect(onlineMatch).toStrictEqual(matchWithClosestVolunteer);
  });
});

describe("decideOnRandomization", () => {
  describe("Social worker feature flag is ENABLED", () => {
    it("should return an ONLINE_MATCH when random number is less or equal to then 1/3", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.2);
      expect(decideOnRandomization(true)).toStrictEqual(1);
    });
    it("should return a PUBLIC_SERVICE when random number is between 1/3 and 2/3", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.4);
      expect(decideOnRandomization(true)).toStrictEqual(2);
    });
    it("should return a SOCIAL_WORKER when random number is between 2/3 and 1", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.75);
      expect(decideOnRandomization(true)).toStrictEqual(3);
    });
  });
  describe("Social worker feature flag is DISABLED", () => {
    it("should return an ONLINE_MATCH when random number is less than or equal to 1/2", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.2);
      expect(decideOnRandomization(false)).toStrictEqual(1);
    });
    it("should return a PUBLIC_SERVICE when random number is greater than 1/2", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.6);
      expect(decideOnRandomization(false)).toStrictEqual(2);
    });
    it("should return a PUBLIC_SERVICE when random number is between 2/3 and 1", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.75);
      expect(decideOnRandomization(false)).toStrictEqual(2);
    });
  });
});
