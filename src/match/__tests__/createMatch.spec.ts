import { checkVolunteerAvailability } from "../createMatch";

describe("checkVolunteerAvailability()", () => {
  it("should return false if volunteer is not available after receiving a new match", () => {
    const currentMatches = 2;
    const maxMatches = 3;

    const isVolunteerAvailable = checkVolunteerAvailability(
      currentMatches,
      maxMatches
    );

    expect(isVolunteerAvailable).toStrictEqual(false);
  });

  it("should return true if volunteer is still available after receiving a new match", () => {
    const currentMatches = 1;
    const maxMatches = 3;

    const isVolunteerAvailable = checkVolunteerAvailability(
      currentMatches,
      maxMatches
    );

    expect(isVolunteerAvailable).toStrictEqual(true);
  });
});
