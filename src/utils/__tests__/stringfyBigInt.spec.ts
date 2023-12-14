import { describe, it, expect } from "@jest/globals";
import { stringfyBigInt } from "../stringfyBigInt";

describe("stringfyBigInt()", () => {
  it("should parse BigInt values inside an obj to String", () => {
    expect(
      stringfyBigInt({ x: BigInt(1), y: "mock", z: BigInt(100) })
    ).toStrictEqual({ x: "1", y: "mock", z: "100" });
  });
});
