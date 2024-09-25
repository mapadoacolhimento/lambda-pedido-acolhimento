import type { SupportRequests } from "@prisma/client";
import directToSocialWorker from "../directToSocialWorker";

import * as zendeskClient from "../../zendeskClient";
import * as emailClient from "../../emailClient";
import * as getCurrentDate from "../../utils/getCurrentDate";
import type { ZendeskTicket, ZendeskUser } from "../../types";

import { prismaMock } from "../../setupTests";
import { SOCIAL_WORKER_ZENDESK_USER_ID } from "../../constants";

const updateTicketMock = jest.spyOn(zendeskClient, "updateTicket");
const getUserMock = jest.spyOn(zendeskClient, "getUser");
const getCurrentDateMock = jest.spyOn(getCurrentDate, "default");
const sendEmailSocialWorkerMock = jest.spyOn(
  emailClient,
  "sendEmailSocialWorker"
);

const mockCurrentDate = "2023-12-28";

describe("directToSocialWorker", () => {
  beforeEach(() => {
    const mockSupportRequest = {
      zendeskTicketId: 123123123 as unknown as bigint,
    } as SupportRequests;
    const mockMsrZendeskTicket = {
      id: 123412341234 as unknown as bigint,
    } as ZendeskTicket;
    const mockMsrZendeskUser = {
      name: "Teste MSR Social Worker",
      email: "test-social-worker@email.com",
    } as ZendeskUser;
    prismaMock.supportRequests.update.mockResolvedValue(mockSupportRequest);
    updateTicketMock.mockResolvedValueOnce(mockMsrZendeskTicket);
    getCurrentDateMock.mockImplementation(() => mockCurrentDate);
    getUserMock.mockResolvedValue(mockMsrZendeskUser);
    sendEmailSocialWorkerMock.mockResolvedValueOnce(true);
  });

  it("should throw an error if no msr is found in Zendesk", async () => {
    getUserMock.mockResolvedValueOnce(null);

    await expect(directToSocialWorker(2)).rejects.toThrow(
      "Couldn't fetch msr from zendesk"
    );
  });

  it("should update support request with correct params", async () => {
    await directToSocialWorker(2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.supportRequests.update).toHaveBeenCalledWith({
      where: {
        supportRequestId: 2,
      },
      data: {
        status: "social_worker",
        SupportRequestStatusHistory: {
          create: {
            status: "social_worker",
          },
        },
      },
      select: {
        zendeskTicketId: true,
        msrId: true,
      },
    });
  });

  it("should call updateTicket with correct social worker ticket", async () => {
    await directToSocialWorker(2);
    const socialWorkerTicket = {
      id: 123123123,
      status: "pending",
      assignee_id: SOCIAL_WORKER_ZENDESK_USER_ID,
      custom_fields: [
        {
          id: 360014379412,
          value: "encaminhamento__assistente_social",
        },
        {
          id: 360017432652,
          value: "2023-12-28",
        },
      ],
    };
    expect(updateTicketMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(socialWorkerTicket)
    );
    expect(updateTicketMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        comment: expect.objectContaining({
          body: "Não encontramos uma voluntária próxima disponível e MSR foi encaminhada para assistente social.",
          public: false,
        }),
      })
    );
  });

  it("should call sendEmailSocialWorker with correct params", async () => {
    await directToSocialWorker(2);
    expect(sendEmailSocialWorkerMock).toHaveBeenNthCalledWith(
      1,
      "test-social-worker@email.com",
      "Teste MSR Social Worker",
      "123123123"
    );
  });
});
