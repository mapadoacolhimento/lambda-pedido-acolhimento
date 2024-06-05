import client from "../prismaClient";
import getErrorMessage from "./getErrorMessage";

export default async function saveBusaraABExperiment(
  msrId: bigint,
  supportRequestId: number,
  transactionalId: string,
  hasMatch: boolean = false
) {
  try {
    let matchId = null;

    if (hasMatch) {
      const match = await client.matches.findFirst({
        where: {
          supportRequestId: supportRequestId,
          msrId: msrId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          matchId: true,
        },
      });

      matchId = match?.matchId ? match?.matchId : null;
    }

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
