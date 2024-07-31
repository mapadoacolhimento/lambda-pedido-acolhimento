import type { Decimal } from "@prisma/client/runtime/library";
import getOnlineVolunteer, {
  getExpandedVolunteer,
  getIdealVolunteer,
} from "../volunteer";
import * as matchLogic from "../matchLogic";
import { IDEAL_MATCH_MAX_DISTANCE } from "../../constants";

const mockFindClosestVolunteer = jest.spyOn(matchLogic, "findClosestVolunteer");
const mockFindVolunteerInTheSameCity = jest.spyOn(
  matchLogic,
  "findVolunteerInTheSameCity"
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
  lat: 123 as unknown as Decimal,
  lng: 234 as unknown as Decimal,
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
});
