import getInfoMsr from "../getMsrInfo";
import { prismaMock } from "../../setupTests";
import type { MSRs } from "@prisma/client";

const msrId = 123456789 as unknown as bigint;
describe("getInfoMsr()", () => {
  it("should return null when dont find any information", async () => {
    prismaMock.mSRs.findUnique.mockResolvedValueOnce(null);
    expect(await getInfoMsr(msrId)).toBeNull();
  });

  it("should return all information when found", async () => {
    prismaMock.mSRs.findUnique.mockResolvedValueOnce({
      MSRViolenceHistory: [
        {
          msrViolenceHistoryId: 1234,
          msrId: msrId,
          violenceType: [
            "physical_violence",
            "psychological_violence",
            "sexual_violence",
          ],
          violenceTime: "between_3_months_and_1_year",
          violenceOccurredInBrazil: true,
          perpetratorGender: "man",
          violencePerpetrator: ["ex_partner"],
          livesWithPerpetrator: "no",
          violenceLocation: ["home_space"],
          legalActionsTaken: ["physical_examination", "police_inquiry"],
          legalActionDifficulty: ["not_applicable"],
          protectiveFactors: ["support_network"],
          riskFactors: ["no_support_network"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      MSRSocioeconomicData: {
        msrSocioeconomicId: 4567,
        msrId: msrId,
        hasMonthlyIncome: "yes",
        monthlyIncomeRange: "up_to_one_minimum_wage",
        employmentStatus: "employed_clt",
        hasFinancialDependents: "yes",
        familyProvider: "yes",
        propertyOwnership: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      gender: "cis_woman",
      state: "MG",
      MSRPii: {
        dateOfBirth: "2000-01-17",
      },
    } as unknown as MSRs);

    expect(await getInfoMsr(123456789 as unknown as bigint)).toStrictEqual({
      age: "26",
      gender: "Mulher cisgênero",
      state: "MG",
      hasMonthlyIncome: "Sim",
      monthlyIncomeRange: "Entre meio a um salário mínimo",
      employmentStatus: "Empregada (CLT)",
      hasFinancialDependents: "Sim",
      familyProvider: "Sim",
      propertyOwnership: "Não",
      violenceType: "Violência física,Violência psicológica,Violência sexual",
      violenceTime: "Entre 3 meses e 1 ano",
      perpetratorGender: "Homem",
      violencePerpetrator: "Parceiro(a) anterior",
      livesWithPerpetrator: "Não",
      violenceLocation: "Ambiente doméstico",
      legalActionsTaken: "Exame de corpo de delito (IML),Inquérito policial",
      legalActionDifficulty: "Não se aplica",
    });
  });
  it("should return some information when found", async () => {
    prismaMock.mSRs.findUnique.mockResolvedValueOnce({
      MSRViolenceHistory: [
        {
          msrViolenceHistoryId: 1234,
          msrId: msrId,
          violenceType: [
            "physical_violence",
            "psychological_violence",
            "sexual_violence",
          ],
          violenceTime: null,
          violenceOccurredInBrazil: true,
          perpetratorGender: null,
          violencePerpetrator: [],
          livesWithPerpetrator: null,
          violenceLocation: [],
          legalActionsTaken: [],
          legalActionDifficulty: [],
          protectiveFactors: [],
          riskFactors: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      MSRSocioeconomicData: {
        msrSocioeconomicId: 4567,
        msrId: msrId,
        hasMonthlyIncome: "yes",
        monthlyIncomeRange: "up_to_one_minimum_wage",
        employmentStatus: "employed_clt",
        hasFinancialDependents: "yes",
        familyProvider: "yes",
        propertyOwnership: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      gender: "cis_woman",
      state: "MG",
      MSRPii: {
        dateOfBirth: "2000-01-17",
      },
    } as unknown as MSRs);

    expect(await getInfoMsr(123456789 as unknown as bigint)).toStrictEqual({
      age: "26",
      gender: "Mulher cisgênero",
      state: "MG",
      hasMonthlyIncome: "Sim",
      monthlyIncomeRange: "Entre meio a um salário mínimo",
      employmentStatus: "Empregada (CLT)",
      hasFinancialDependents: "Sim",
      familyProvider: "Sim",
      propertyOwnership: "Não",
      violenceType: "Violência física,Violência psicológica,Violência sexual",
      violenceTime: "Não informado",
      perpetratorGender: "Não informado",
      violencePerpetrator: "Não informado",
      livesWithPerpetrator: "Não informado",
      violenceLocation: "Não informado",
      legalActionsTaken: "Não informado",
      legalActionDifficulty: "Não informado",
    });
  });
});
