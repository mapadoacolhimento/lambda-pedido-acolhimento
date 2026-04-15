import {
  sendEmailPublicService,
  sendEmailSocialWorker,
  sendEmailToMsr,
  sendEmailToVolunteer,
  sendEmailToVolunteerWithMsrInfo,
} from "..";
import * as sendEmail from "../../emailClient/sendEmail";
import { prismaMock } from "../../setupTests";
import type { MSRs } from "@prisma/client";

const sendEmailMock = jest.spyOn(sendEmail, "default");
const msr = {
  id: 12345678 as unknown as bigint,
  name: "teste msr",
  email: "teste@msr.com",
  encoded_id: "ABC-123",
};
const volunteer = {
  firstName: "Voluntaria",
  lastName: "Teste",
  phone: "11911091199",
  registrationNumber: "123123",
  email: "teste@voluntaria.com",
  encoded_id: "EFG-456",
};

describe("sendEmailPublicService", () => {
  beforeEach(() => {
    sendEmailMock.mockResolvedValueOnce(true);
  });
  it("should call sendEmail with correct params", async () => {
    const encodedId = "ABC-123";
    const res = await sendEmailPublicService(
      "test@msr.com",
      "teste MSR",
      encodedId
    );
    expect(res).toStrictEqual(true);
    expect(sendEmailMock).toHaveBeenNthCalledWith(
      1,
      "test@msr.com",
      "clv43j25d00b0y19vj7x8qdxy",
      {
        msr_first_name: "Teste",
        msr_zendesk_ticket_id: encodedId,
      }
    );
  });
});

describe("sendEmailSocialWorker", () => {
  beforeEach(() => {
    sendEmailMock.mockResolvedValueOnce(true);
  });
  it("should call sendEmail with correct params", async () => {
    const encodedId = "ABC-123";
    const res = await sendEmailSocialWorker(
      "test@msr.com",
      "teste MSR",
      encodedId
    );
    expect(res).toStrictEqual(true);
    expect(sendEmailMock).toHaveBeenNthCalledWith(
      1,
      "test@msr.com",
      "clv4a8qf1004meoqo89fcfjy7",
      {
        msr_first_name: "Teste",
        msr_zendesk_ticket_id: encodedId,
      }
    );
  });
});

describe("sendEmailToMsr", () => {
  beforeEach(() => {
    sendEmailMock.mockResolvedValueOnce(true);
  });
  describe("Psychological", () => {
    it("should call sendEmail with correct params", async () => {
      const res = await sendEmailToMsr(
        msr,
        volunteer,
        "clv4977jg01a7hlj1twd22zq1"
      );
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@msr.com",
        "clv4977jg01a7hlj1twd22zq1",
        {
          msr_first_name: "Teste",
          volunteer_name: "Voluntaria Teste",
          volunteer_phone: "11911091199",
          lawyer_phone: "11911091199",
          volunteer_registration_number: "123123",
          msr_zendesk_ticket_id: msr.encoded_id,
        }
      );
    });
  });
  describe("Legal", () => {
    it("should call sendEmail with correct params", async () => {
      const res = await sendEmailToMsr(
        msr,
        volunteer,
        "clv43f8gd02evj3woijkqcgng"
      );
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@msr.com",
        "clv43f8gd02evj3woijkqcgng",
        {
          msr_first_name: "Teste",
          volunteer_name: "Voluntaria Teste",
          volunteer_phone: "11911091199",
          lawyer_phone: "11911091199",
          volunteer_registration_number: "123123",
          msr_zendesk_ticket_id: msr.encoded_id,
        }
      );
    });
  });
});

describe("sendEmailToVolunteer", () => {
  beforeEach(() => {
    sendEmailMock.mockResolvedValueOnce(true);
  });
  describe("Psychological", () => {
    it("should call sendEmail with correct params", async () => {
      const res = await sendEmailToVolunteer(
        volunteer,
        msr.name,
        "psychological"
      );
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@voluntaria.com",
        "clv5c4mim008rjwf7bqgvk2ga",
        {
          volunteer_first_name: "Voluntaria",
          msr_first_name: "Teste",
          volunteer_phone: "11911091199",
          volunteer_zendesk_ticket_id: volunteer.encoded_id,
        }
      );
    });
  });
  describe("Legal", () => {
    it("should call sendEmail with correct params", async () => {
      const res = await sendEmailToVolunteer(volunteer, msr.name, "legal");
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@voluntaria.com",
        "clv43jw1t00yj79ezuug2kh6z",
        {
          volunteer_first_name: "Voluntaria",
          msr_first_name: "Teste",
          volunteer_phone: "11911091199",
          volunteer_zendesk_ticket_id: volunteer.encoded_id,
        }
      );
    });
  });

  describe("Psychological with some MSR information", () => {
    it("should call sendEmail with correct params", async () => {
      prismaMock.mSRs.findUnique.mockResolvedValueOnce({
        MSRViolenceHistory: [
          {
            msrViolenceHistoryId: 1234,
            msrId: msr.id,
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
          msrId: msr.id,
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
      const res = await sendEmailToVolunteerWithMsrInfo(
        volunteer,
        msr.name,
        "psychological",
        msr.id
      );
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@voluntaria.com",
        "cmn6it2qq00640iyhikye2b77",
        {
          volunteer_first_name: "Voluntaria",
          msr_first_name: "Teste",
          volunteer_phone: "11911091199",
          volunteer_zendesk_ticket_id: volunteer.encoded_id,
          age: "26",
          gender: "Mulher cisgênero",
          state: "MG",
          monthly_income_range: "Até um salário mínimo",
          employment_status: "Empregada (CLT)",
          has_financial_dependents: "Sim",
          family_provider: "Sim",
          property_ownership: "Não",
          violence_type:
            "Violência física,Violência psicológica,Violência sexual",
          violence_time: "Não informado",
          perpetrator_gender: "Não informado",
          violence_perpetrator: "Não informado",
          lives_with_perpetrator: "Não informado",
          violence_location: "Não informado",
          legal_actions_taken: "Não informado",
          legal_action_difficulty: "Não informado",
        }
      );
    });
  });

  describe("Legal with MSR information not found", () => {
    it("should call sendEmail with correct params", async () => {
      prismaMock.mSRs.findUnique.mockResolvedValueOnce(null);
      const res = await sendEmailToVolunteerWithMsrInfo(
        volunteer,
        msr.name,
        "legal",
        msr.id
      );
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@voluntaria.com",
        "clv43jw1t00yj79ezuug2kh6z",
        {
          volunteer_first_name: "Voluntaria",
          msr_first_name: "Teste",
          volunteer_phone: "11911091199",
          volunteer_zendesk_ticket_id: volunteer.encoded_id,
        }
      );
    });
  });

  describe("Legal with MSR information", () => {
    it("should call sendEmail with correct params", async () => {
      prismaMock.mSRs.findUnique.mockResolvedValueOnce({
        MSRViolenceHistory: [
          {
            msrViolenceHistoryId: 1234,
            msrId: msr.id,
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
          msrId: msr.id,
          hasMonthlyIncome: "no_access",
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
      const res = await sendEmailToVolunteerWithMsrInfo(
        volunteer,
        msr.name,
        "legal",
        msr.id
      );
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@voluntaria.com",
        "cmn6gu68l0bfp0i250o3o2py1",
        {
          volunteer_first_name: "Voluntaria",
          msr_first_name: "Teste",
          volunteer_phone: "11911091199",
          volunteer_zendesk_ticket_id: volunteer.encoded_id,
          age: "26",
          gender: "Mulher cisgênero",
          state: "MG",
          monthly_income_range: "Até um salário mínimo (Sem acesso a renda)",
          employment_status: "Empregada (CLT)",
          has_financial_dependents: "Sim",
          family_provider: "Sim",
          property_ownership: "Não",
          violence_type:
            "Violência física,Violência psicológica,Violência sexual",
          violence_time: "Entre 3 meses e 1 ano",
          perpetrator_gender: "Homem",
          violence_perpetrator: "Ex-parceiro(a)",
          lives_with_perpetrator: "Não",
          violence_location: "Ambiente doméstico",
          legal_actions_taken:
            "Exame de corpo de delito (IML),Inquérito policial",
          legal_action_difficulty: "Não se aplica",
        }
      );
    });
  });
});
