import { describe, it, expect } from "@jest/globals";
import { generatePolicy } from "../generatePolicy";

describe("generatePolicy()", () => {
  it("should generate an auth reponse based on effect, pricinpalId and resource", () => {
    expect(generatePolicy("Allow", "123", "resource")).toStrictEqual({
      principalId: "123",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "resource",
          },
        ],
      },
    });
  });
});
