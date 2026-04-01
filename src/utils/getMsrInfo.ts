import client from "../prismaClient";
import {
  MONTHLY_INCOME_RANGES,
  FAMILY_PROVIDER,
  EMPLOYMENT_STATUS,
  VIOLENCE_TYPES,
  VIOLENCE_TIME,
  PREPATATOR_GENDER,
  VIOLENCE_PERPETRATOR,
  LIVES_WITH_PERPETRATOR,
  VIOLENCE_LOCATION,
  LEGAL_ACTION_TAKEN,
  LEGAL_ACTION_DIFFICULTY,
  GENDER,
} from "../constants";
import type { MSRInformations } from "../types";

function mapArrayType(fieldType: string[], map: Record<string, string>) {
  if (fieldType.length === 0) {
    return "Não informado";
  }
  return fieldType
    .map((type) => map[type])
    .filter((v): v is string => !!v)
    .join(",");
}

function getAge(dateOfBirth: Date) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age.toString();
}

export default async function getMsrInfo(msrId: bigint) {
  try {
    const msr = await client.mSRs.findUnique({
      where: { msrId: msrId },
      select: {
        gender: true,
        state: true,
        MSRPii: {
          select: {
            dateOfBirth: true,
          },
        },
        MSRSocioeconomicData: true,
        MSRViolenceHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const msrViolenceHistory = msr?.MSRViolenceHistory[0];
    const msrSocioeconomicData = msr?.MSRSocioeconomicData;

    if (!msr || !msrSocioeconomicData || !msrViolenceHistory) {
      return null;
    }
    const hasMonthlyIncome = msrSocioeconomicData?.hasMonthlyIncome;
    const incomeAccessSuffix =
      hasMonthlyIncome === "no_access" ? " (Sem acesso a renda)" : "";

    const msrInfo: MSRInformations = {
      age: msr?.MSRPii?.dateOfBirth
        ? getAge(msr.MSRPii.dateOfBirth)
        : "Não informado",
      gender: msr?.gender ? GENDER[msr.gender] : "Não informado",
      state: msr?.state ? msr.state : "Não informado",
      monthlyIncomeRange: msrSocioeconomicData.monthlyIncomeRange
        ? MONTHLY_INCOME_RANGES[msrSocioeconomicData.monthlyIncomeRange] +
          incomeAccessSuffix
        : "Não informado",
      employmentStatus: msrSocioeconomicData.employmentStatus
        ? EMPLOYMENT_STATUS[msrSocioeconomicData.employmentStatus]
        : "Não informado",
      hasFinancialDependents: msrSocioeconomicData?.hasFinancialDependents
        ? "Sim"
        : "Não",
      familyProvider: msrSocioeconomicData.familyProvider
        ? FAMILY_PROVIDER[msrSocioeconomicData.familyProvider]
        : "Não informado",
      propertyOwnership: msrSocioeconomicData?.propertyOwnership
        ? "Sim"
        : "Não",
      violenceType: msrViolenceHistory.violenceType
        ? mapArrayType(msrViolenceHistory.violenceType, VIOLENCE_TYPES)
        : "Não informado",
      violenceTime: msrViolenceHistory?.violenceTime
        ? VIOLENCE_TIME[msrViolenceHistory.violenceTime]
        : "Não informado",
      perpetratorGender: msrViolenceHistory.perpetratorGender
        ? PREPATATOR_GENDER[msrViolenceHistory.perpetratorGender]
        : "Não informado",
      violencePerpetrator: msrViolenceHistory.violencePerpetrator
        ? mapArrayType(
            msrViolenceHistory.violencePerpetrator,
            VIOLENCE_PERPETRATOR
          )
        : "Não informado",
      livesWithPerpetrator: msrViolenceHistory.livesWithPerpetrator
        ? LIVES_WITH_PERPETRATOR[msrViolenceHistory.livesWithPerpetrator]
        : "Não informado",
      violenceLocation: msrViolenceHistory.violenceLocation
        ? mapArrayType(msrViolenceHistory.violenceLocation, VIOLENCE_LOCATION)
        : "Não informado",
      legalActionsTaken: msrViolenceHistory.legalActionsTaken
        ? mapArrayType(msrViolenceHistory.legalActionsTaken, LEGAL_ACTION_TAKEN)
        : "Não informado",
      legalActionDifficulty: msrViolenceHistory.legalActionDifficulty
        ? mapArrayType(
            msrViolenceHistory.legalActionDifficulty,
            LEGAL_ACTION_DIFFICULTY
          )
        : "Não informado",
    };

    return {
      ...msrInfo,
    };
  } catch (error) {
    console.error(`Error fetching MSRdata for msrId ${msrId}:`, error);
    throw new Error("Failed to fetch MSR data");
  }
}
