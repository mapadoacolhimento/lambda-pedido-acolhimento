import {
  filterVolunteersWithLatLng,
  calcDistance,
  findClosestVolunteer,
  findVolunteerInTheSameCity,
  filterVolunteersInTheSameState,
  createIdealMatch,
  createExpandedMatch,
  createOnlineMatch,
} from "../matchLogic";
import type { Decimal } from "@prisma/client/runtime/library";
import type { VolunteerAvailability } from "@prisma/client";
import { prismaMock } from "../../setupTests";

describe("filterVolunteersWithLatLng()", () => {
  it("should filter only the volunteers with not null lat lng", () => {
    const volunteerAvailability: VolunteerAvailability[] = [
      {
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
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
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
        lat: null,
        lng: null,
        city: "SAO PAULO",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const volunteersWithLatLng = filterVolunteersWithLatLng(
      volunteerAvailability
    );

    expect(volunteersWithLatLng).toStrictEqual([volunteerAvailability[0]]);
  });
});

describe("calcDistance()", () => {
  it("should calc the distance between two points", () => {
    const pointA = [-46.677838300000005, -23.558022253540766];
    const pointB = [-46.67717311213874, -23.559121271037963];

    const distance = calcDistance(pointA, pointB);

    expect(distance).toStrictEqual(0.1397536534439166);
  });
});

describe("findClosestVolunteer()", () => {
  it("should return null if the msr has null lat lng", () => {
    const volunteerAvailability: VolunteerAvailability[] = [
      {
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
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const msrLat = null;
    const msrLng = null;

    const closestVolunteer = findClosestVolunteer(
      msrLat,
      msrLng,
      volunteerAvailability,
      null
    );

    expect(closestVolunteer).toStrictEqual(null);
  });

  it("should return null if there is no volunteer with not null lat lng", () => {
    const volunteerAvailability: VolunteerAvailability[] = [
      {
        volunteer_id: 1,
        current_matches: 0,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: null,
        lng: null,
        city: "SAO PAULO",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const msrLat = -23.45581927562912;
    const msrLng = -45.066556703531184;

    const closesVolunteer = findClosestVolunteer(
      msrLat,
      msrLng,
      volunteerAvailability,
      null
    );

    expect(closesVolunteer).toStrictEqual(null);
  });

  it("should return the closest volunteer if the maxDistance is null", () => {
    const volunteerAvailability: VolunteerAvailability[] = [
      {
        volunteer_id: 1,
        current_matches: 0,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: -23.455917719549397 as unknown as Decimal,
        lng: -45.06648159814469 as unknown as Decimal,
        city: "UBATUBA",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
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
        lat: -8.062561606296475 as unknown as Decimal,
        lng: -34.91897018325968 as unknown as Decimal,
        city: "RECIFE",
        state: "PE",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const msrLat = -23.45581927562912;
    const msrLng = -45.066556703531184;

    const closestVolunteer = findClosestVolunteer(
      msrLat,
      msrLng,
      volunteerAvailability,
      null
    );

    expect(closestVolunteer?.volunteer_id).toStrictEqual(1);
  });

  it("should return the closest volunteer within maxDistance when maxDistance is not null", () => {
    const volunteerAvailability: VolunteerAvailability[] = [
      {
        volunteer_id: 1,
        current_matches: 0,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: -23.455917719549397 as unknown as Decimal,
        lng: -45.06648159814469 as unknown as Decimal,
        city: "UBATUBA",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
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
        lat: -8.062561606296475 as unknown as Decimal,
        lng: -34.91897018325968 as unknown as Decimal,
        city: "RECIFE",
        state: "PE",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
      {
        volunteer_id: 3,
        current_matches: 0,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: -23.526032327909142 as unknown as Decimal,
        lng: -46.68335478204428 as unknown as Decimal,
        city: "SAO PAULO",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const msrLat = -23.556168561396397;
    const msrLng = -46.67920269003776;
    const maxDistance = 20;

    const closestVolunteer = findClosestVolunteer(
      msrLat,
      msrLng,
      volunteerAvailability,
      maxDistance
    );

    expect(closestVolunteer?.volunteer_id).toStrictEqual(3);
  });
});

describe("findVolunteerInTheSameCity()", () => {
  it("should return null if msr city and state are not_found", () => {
    const msrCity = "not_found";
    const msrState = "not_found";
    const volunteerAvailability: VolunteerAvailability[] = [
      {
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
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const volunteerInTheSameCity = findVolunteerInTheSameCity(
      msrCity,
      msrState,
      volunteerAvailability
    );

    expect(volunteerInTheSameCity).toStrictEqual(null);
  });

  it("should return null if there are no volunteers in the same city as the msr", () => {
    const msrCity = "UBATUBA";
    const msrState = "SP";
    const volunteerAvailability: VolunteerAvailability[] = [
      {
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
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const volunteerInTheSameCity = findVolunteerInTheSameCity(
      msrCity,
      msrState,
      volunteerAvailability
    );

    expect(volunteerInTheSameCity).toStrictEqual(null);
  });

  it("should return a volunteer that is in the same city as the msr", () => {
    const msrCity = "SAO PAULO";
    const msrState = "SP";
    const volunteerAvailability: VolunteerAvailability[] = [
      {
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
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
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
        lat: -23.45581927562912 as unknown as Decimal,
        lng: -45.066556703531184 as unknown as Decimal,
        city: "UBATUBA",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const volunteerInTheSameCity = findVolunteerInTheSameCity(
      msrCity,
      msrState,
      volunteerAvailability
    );

    expect(volunteerInTheSameCity?.volunteer_id).toStrictEqual(1);
  });
});

describe("filterVolunteersInTheSameState()", () => {
  it("should return an empty array if msr state is not_found", () => {
    const msrState = "not_found";
    const volunteerAvailability: VolunteerAvailability[] = [
      {
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
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const volunteerInTheSameState = filterVolunteersInTheSameState(
      msrState,
      volunteerAvailability
    );

    expect(volunteerInTheSameState).toStrictEqual([]);
  });

  it("should return an empty array if there are no volunteers in the same state as the msr", () => {
    const msrState = "SP";
    const volunteerAvailability: VolunteerAvailability[] = [
      {
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
        city: "RECIFE",
        state: "PE",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const volunteerInTheSameState = filterVolunteersInTheSameState(
      msrState,
      volunteerAvailability
    );

    expect(volunteerInTheSameState).toStrictEqual([]);
  });

  it("should return a list of volunteers that are in the same state as the msr", () => {
    const msrState = "SP";
    const volunteerAvailability: VolunteerAvailability[] = [
      {
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
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
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
        lat: -23.45581927562912 as unknown as Decimal,
        lng: -45.066556703531184 as unknown as Decimal,
        city: "UBATUBA",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
      {
        volunteer_id: 3,
        current_matches: 0,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: -23.45581927562912 as unknown as Decimal,
        lng: -45.066556703531184 as unknown as Decimal,
        city: "RECIFE",
        state: "PE",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const volunteerInTheSameState = filterVolunteersInTheSameState(
      msrState,
      volunteerAvailability
    );

    expect(volunteerInTheSameState).toStrictEqual([
      {
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
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
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
        lat: -23.45581927562912 as unknown as Decimal,
        lng: -45.066556703531184 as unknown as Decimal,
        city: "UBATUBA",
        state: "SP",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ]);
  });
});

describe("createIdealMatch()", () => {
  it("should return null if there are no volunteers within 20km", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 1,
      supportType: "psychological" as const,
      lat: -23.556080048271628,
      lng: -46.679234876547184,
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
      volunteerAvailability
    );

    expect(idealMatch).toStrictEqual(null);
  });

  it("should return an ideal match if there is a volunteer within 20km", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 1,
      supportType: "psychological" as const,
      lat: -23.55603087428766,
      lng: -46.67928852072954,
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
      volunteerAvailability
    );

    expect(idealMatch).toStrictEqual(match);
  });
});

describe("createExpandedMatch()", () => {
  it("should return null if there are no volunteers in the same city", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 1,
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
      volunteerAvailability
    );

    expect(expandedMatch).toStrictEqual(null);
  });

  it("should return an expanded match if there is a volunteer in the same city", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 1,
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
      volunteerAvailability
    );

    expect(expandedMatch).toStrictEqual(match);
  });
});

describe("createOnlineMatch()", () => {
  it("should return null if there are no volunteers available", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 1,
      supportType: "psychological" as const,
      lat: -23.556148891818268,
      lng: -46.67917050352835,
      city: "SAO PAULO",
      state: "SP",
    };

    const volunteerAvailability: VolunteerAvailability[] = [];

    const onlineMatch = await createOnlineMatch(
      supportRequest,
      volunteerAvailability
    );

    expect(onlineMatch).toStrictEqual(null);
  });

  it("should return an online match in the are volunteers available", async () => {
    const supportRequest = {
      supportRequestId: 1,
      msrId: 1,
      zendeskTicketId: 1,
      supportType: "psychological" as const,
      lat: -23.556148891818268,
      lng: -46.67917050352835,
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
      volunteerAvailability
    );

    expect(onlineMatch).toStrictEqual(match);
  });
});