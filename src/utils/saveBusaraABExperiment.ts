import client from "../prismaClient";
import type { SupportRequest } from "../types";
import getErrorMessage from "./getErrorMessage";

type SaveBusaraAbExperimentParams = {
  msrId: SupportRequest["msrId"];
  supportRequestId: SupportRequest["supportRequestId"];
  transactionalId: string;
  matchId: number;
};

export default async function saveBusaraABExperiment({
  msrId,
  supportRequestId,
  transactionalId,
  matchId,
}: SaveBusaraAbExperimentParams) {
  try {
    const busaraABExperiment = await client.busaraABExperiment.create({
      data: {
        msrId: msrId,
        matchId: matchId,
        supportRequestId: supportRequestId,
        transactionalId: transactionalId,
      },
    });
    return busaraABExperiment;
  } catch (e) {
    console.error(
      `Something went wrong when trying to save busaraABExperiment: ${getErrorMessage(
        e
      )}`
    );
    return null;
  }
}
