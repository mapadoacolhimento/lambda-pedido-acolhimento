import client from "../prismaClient";
import getErrorMessage from "./getErrorMessage";

export default async function saveBusaraABExperiment(
  msrId: bigint,
  supportRequestId: number,
  transactionalId: string,
  matchId?: number
) {
  try {
    const busaraABExperiment = await client.busaraABExperiment.create({
      data: {
        msrId: msrId,
        matchId: matchId ? matchId : null,
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
