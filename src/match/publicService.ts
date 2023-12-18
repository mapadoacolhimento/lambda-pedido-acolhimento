import client from "../client";

export async function directToPublicService(supportRequestId: number) {
  const updateSupportRequest = await client.supportRequests.update({
    where: {
      supportRequestId: supportRequestId,
    },
    data: {
      status: "public_service",
      SupportRequestStatusHistory: {
        create: {
          status: "public_service",
        },
      },
    },
  });

  return updateSupportRequest;
}
