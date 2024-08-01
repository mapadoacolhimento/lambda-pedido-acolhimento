import type { VolunteerAvailability } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";
import {
  filterVolunteersWithLatLng,
  calcDistance,
  findClosestVolunteer,
  findVolunteerInTheSameCity,
  filterVolunteersInTheSameState,
} from "../volunteerLogic";

describe("filterVolunteersWithLatLng()", () => {
  it("should filter only the volunteers with not null lat lng", () => {
    const volunteerAvailability = [
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
    const volunteerAvailability = [
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
    const volunteerAvailability = [
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

    const msrLat = -23.45581927562912 as unknown as Decimal;
    const msrLng = -45.066556703531184 as unknown as Decimal;

    const closesVolunteer = findClosestVolunteer(
      msrLat,
      msrLng,
      volunteerAvailability,
      null
    );

    expect(closesVolunteer).toStrictEqual(null);
  });

  it("should return the closest volunteer if the maxDistance is null", () => {
    const volunteerAvailability = [
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

    const msrLat = -23.45581927562912 as unknown as Decimal;
    const msrLng = -45.066556703531184 as unknown as Decimal;

    const closestVolunteer = findClosestVolunteer(
      msrLat,
      msrLng,
      volunteerAvailability,
      null
    );

    expect(closestVolunteer?.volunteer_id).toStrictEqual(1);
  });

  it("should return the first volunteer within maxDistance when maxDistance is not null", () => {
    const volunteerAvailability = [
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
      {
        volunteer_id: 1,
        current_matches: 1,
        max_matches: 2,
        is_available: true,
        support_type: "psychological" as const,
        support_expertise: "",
        offers_online_support: true,
        offers_libras_support: false,
        lat: -23.556168561396397 as unknown as Decimal,
        lng: -46.67930269003776 as unknown as Decimal,
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
        lat: -8.062561606296475 as unknown as Decimal,
        lng: -34.91897018325968 as unknown as Decimal,
        city: "RECIFE",
        state: "PE",
        updated_at: new Date("2023-01-01"),
        created_at: new Date("2023-01-01"),
      },
    ];

    const msrLat = -23.556168561396397 as unknown as Decimal;
    const msrLng = -46.67920269003776 as unknown as Decimal;
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
    const volunteerAvailability = [
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
    const volunteerAvailability = [
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
    const volunteerAvailability = [
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
    const volunteerAvailability = [
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
    const volunteerAvailability = [
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
