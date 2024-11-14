import type { VolunteerAvailability } from "@prisma/client";
import { checkUpdateVolunteerStatus } from "../createMatch";

const mockVolunteerAvailability = {
  volunteer_id: 1,
  current_matches: 1,
  max_matches: 2,
  is_available: true,
} as VolunteerAvailability;

describe("checkUpdateVolunteerStatus()", () => {
  it("should return true if volunteer was previously available and is reaching the max matches", () => {
    const shouldUpdateVolunteerStatus = checkUpdateVolunteerStatus(
      mockVolunteerAvailability
    );

    expect(shouldUpdateVolunteerStatus).toStrictEqual(true);
  });

  it("should return false if volunteer was previously available but is not reaching the max matches", () => {
    const shouldUpdateVolunteerStatus = checkUpdateVolunteerStatus({
      ...mockVolunteerAvailability,
      max_matches: 3,
    });

    expect(shouldUpdateVolunteerStatus).toStrictEqual(false);
  });

  it("should return false if volunteer was not previously available", () => {
    const shouldUpdateVolunteerStatus = checkUpdateVolunteerStatus({
      ...mockVolunteerAvailability,
      is_available: false,
    });

    expect(shouldUpdateVolunteerStatus).toStrictEqual(false);
  });
});
