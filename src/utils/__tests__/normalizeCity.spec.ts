import normalizeCity from "../normalizeCity";

describe("normalizeCity", () => {
  it("should return 'not_found' if city is 'not_found'", () => {
    expect(normalizeCity("not_found")).toStrictEqual("not_found");
  });
  it("should normalize the city value", () => {
    expect(normalizeCity("São Paulo")).toStrictEqual("SAO PAULO");
  });
});
