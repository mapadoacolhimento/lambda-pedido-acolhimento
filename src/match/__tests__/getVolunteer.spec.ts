import type { Decimal } from "@prisma/client/runtime/library";
import * as volunteerLogic from "../volunteerLogic";
import { IDEAL_MATCH_MAX_DISTANCE } from "../../constants";
import {
  getIdealVolunteer,
  getExpandedVolunteer,
  getOnlineVolunteer,
} from "../getVolunteer";

const mockFindClosestVolunteer = jest.spyOn(
  volunteerLogic,
  "findClosestVolunteer"
);
const mockFindVolunteerInTheSameCity = jest.spyOn(
  volunteerLogic,
  "findVolunteerInTheSameCity"
);
const mockFindVolunteerInTheSameState = jest.spyOn(
  volunteerLogic,
  "filterVolunteersInTheSameState"
);
const availableVolunteer = {
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
};
const mockSupportRequestGeoreference = {
  lat: -23.5562866 as unknown as Decimal,
  lng: -46.6817454 as unknown as Decimal,
  state: "SP",
  city: "SAO PAULO",
};

describe("getIdealVolunteer()", () => {
  it("should call findClosestVolunteer with correct params", () => {
    getIdealVolunteer(mockSupportRequestGeoreference, [availableVolunteer]);
    expect(mockFindClosestVolunteer).toHaveBeenNthCalledWith(
      1,
      mockSupportRequestGeoreference.lat,
      mockSupportRequestGeoreference.lng,
      [availableVolunteer],
      IDEAL_MATCH_MAX_DISTANCE
    );
  });
});

describe("getExpandedVolunteer()", () => {
  it("should call findVolunteerInTheSameCity with correct params", () => {
    getExpandedVolunteer(mockSupportRequestGeoreference, [availableVolunteer]);
    expect(mockFindVolunteerInTheSameCity).toHaveBeenNthCalledWith(
      1,
      mockSupportRequestGeoreference.city,
      mockSupportRequestGeoreference.state,
      [availableVolunteer]
    );
  });
});

describe("getOnlineVolunteer()", () => {
  it("should return null if there are no volunteers available", () => {
    const onlineVolunteer = getOnlineVolunteer(
      mockSupportRequestGeoreference,
      []
    );

    expect(onlineVolunteer).toStrictEqual(null);
  });

  it("should return the closest volunteer in the state if there are volunteers available in the same state", () => {
    const volunteersAvailableInTheSameState = [
      {
        ...availableVolunteer,
        volunteer_id: 1,
        lat: -23.0159503 as unknown as Decimal,
        lng: -45.5405232 as unknown as Decimal,
        city: "TAUBATE",
        state: "SP",
      },
      {
        ...availableVolunteer,
        volunteer_id: 2,
        lat: -23.4568386 as unknown as Decimal,
        lng: -45.0682371 as unknown as Decimal,
        city: "UBATUBA",
        state: "SP",
      },
    ];

    const volunteersAvailable = [
      ...volunteersAvailableInTheSameState,
      {
        ...availableVolunteer,
        volunteer_id: 3,
        lat: -23.4568386 as unknown as Decimal,
        lng: -45.0682371 as unknown as Decimal,
        city: "BELO HORIZONTE",
        state: "MG",
      },
    ];

    const onlineVolunteer = getOnlineVolunteer(
      mockSupportRequestGeoreference,
      volunteersAvailable
    );

    expect(mockFindVolunteerInTheSameState).toHaveBeenNthCalledWith(
      1,
      mockSupportRequestGeoreference.state,
      volunteersAvailable
    );
    expect(mockFindClosestVolunteer).toHaveBeenNthCalledWith(
      1,
      mockSupportRequestGeoreference.lat,
      mockSupportRequestGeoreference.lng,
      volunteersAvailableInTheSameState,
      null
    );
    expect(onlineVolunteer).toStrictEqual({
      ...volunteersAvailableInTheSameState[0],
      distance: 131.13457617335425,
    });
  });

  it("should return the closest volunteer if there are NO volunteers available in the same state", () => {
    const volunteersAvailable = [
      {
        ...availableVolunteer,
        volunteer_id: 1,
        lat: -13.1026981 as unknown as Decimal,
        lng: -63.9884441 as unknown as Decimal,
        city: "MANAUS",
        state: "AM",
      },
      {
        ...availableVolunteer,
        volunteer_id: 3,
        lat: -20.1241164 as unknown as Decimal,
        lng: -44.2221744 as unknown as Decimal,
        city: "BELO HORIZONTE",
        state: "MG",
      },
    ];

    const onlineVolunteer = getOnlineVolunteer(
      mockSupportRequestGeoreference,
      volunteersAvailable
    );

    expect(mockFindVolunteerInTheSameState).toHaveBeenNthCalledWith(
      1,
      mockSupportRequestGeoreference.state,
      volunteersAvailable
    );
    expect(mockFindClosestVolunteer).toHaveBeenNthCalledWith(
      1,
      mockSupportRequestGeoreference.lat,
      mockSupportRequestGeoreference.lng,
      volunteersAvailable,
      null
    );
    expect(onlineVolunteer).toStrictEqual({
      ...volunteersAvailable[1],
      distance: 458.3290967184196,
    });
  });

  it("should return any volunteer if none have lat/lng info", () => {
    const volunteersAvailable = [
      {
        ...availableVolunteer,
        volunteer_id: 1,
        lat: null,
        lng: null,
      },
      {
        ...availableVolunteer,
        volunteer_id: 2,
        lat: null,
        lng: null,
      },
    ];

    const onlineVolunteer = getOnlineVolunteer(
      mockSupportRequestGeoreference,
      volunteersAvailable
    );

    expect(mockFindVolunteerInTheSameState).toHaveBeenNthCalledWith(
      1,
      mockSupportRequestGeoreference.state,
      volunteersAvailable
    );
    expect(mockFindClosestVolunteer).toHaveBeenNthCalledWith(
      1,
      mockSupportRequestGeoreference.lat,
      mockSupportRequestGeoreference.lng,
      volunteersAvailable,
      null
    );
    expect(onlineVolunteer).toStrictEqual(volunteersAvailable[0]);
  });
});
