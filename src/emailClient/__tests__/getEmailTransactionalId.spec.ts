import {
  BUSARA_MSR_TRANSACTIONAL_EMAIL_IDS,
  TRANSACTIONAL_EMAIL_IDS,
} from "../../constants";
import type { SupportRequest } from "../../types";
import { getEmailTransactionalId } from "../getEmailTransactionalId";

describe("gelTransactionalEmailId group A", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  });
  it("should return transacitonalId from legal email A", () => {
    const trasactionalId = getEmailTransactionalId("legal");
    expect(trasactionalId).toStrictEqual(
      TRANSACTIONAL_EMAIL_IDS["legal"]["msr"]
    );
  });
  it("should return transacitonalId from psychological email A", () => {
    const trasactionalId = getEmailTransactionalId("psychological");
    expect(trasactionalId).toStrictEqual(
      TRANSACTIONAL_EMAIL_IDS["psychological"]["msr"]
    );
  });
  it("should return transacitonalId from publicService email A", () => {
    const trasactionalId = getEmailTransactionalId(
      "publicService" as SupportRequest["supportType"]
    );
    expect(trasactionalId).toStrictEqual(
      TRANSACTIONAL_EMAIL_IDS["publicService"]
    );
  });
  it("should return transacitonalId fromserviceWorker email A", () => {
    const trasactionalId = getEmailTransactionalId(
      "serviceWorker" as SupportRequest["supportType"]
    );
    expect(trasactionalId).toStrictEqual(
      TRANSACTIONAL_EMAIL_IDS["serviceWorker"]
    );
  });
});

describe("gelTransactionalEmailId group B", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.6);
  });
  it("should return transacitonalId from legal email B", () => {
    const trasactionalId = getEmailTransactionalId("legal");
    expect(trasactionalId).toStrictEqual(
      BUSARA_MSR_TRANSACTIONAL_EMAIL_IDS["legal"]["b"]
    );
  });
  it("should return transacitonalId from psychological email B", () => {
    const trasactionalId = getEmailTransactionalId("psychological");
    expect(trasactionalId).toStrictEqual(
      BUSARA_MSR_TRANSACTIONAL_EMAIL_IDS["psychological"]["b"]
    );
  });
  it("should return transacitonalId from publicService email B", () => {
    const trasactionalId = getEmailTransactionalId(
      "publicService" as SupportRequest["supportType"]
    );
    expect(trasactionalId).toStrictEqual(
      BUSARA_MSR_TRANSACTIONAL_EMAIL_IDS["publicService"]["b"]
    );
  });
  it("should return transacitonalId from serviceWorker email B", () => {
    const trasactionalId = getEmailTransactionalId(
      "serviceWorker" as SupportRequest["supportType"]
    );
    expect(trasactionalId).toStrictEqual(
      BUSARA_MSR_TRANSACTIONAL_EMAIL_IDS["serviceWorker"]["b"]
    );
  });
});
