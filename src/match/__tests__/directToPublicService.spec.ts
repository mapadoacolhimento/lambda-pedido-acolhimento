import type { SupportRequests } from "@prisma/client";
import directToPublicService from "../directToPublicService";

import * as zendeskClient from "../../zendeskClient";
import * as emailClient from "../../emailClient";
import * as getCurrentDate from "../../utils/getCurrentDate";
import type { ZendeskTicket, ZendeskUser } from "../../types";
import { AGENT } from "../../constants";

import { prismaMock } from "../../setupTests";

const updateTicketMock = jest.spyOn(zendeskClient, "updateTicket");
const getUserMock = jest.spyOn(zendeskClient, "getUser");
const getCurrentDateMock = jest.spyOn(getCurrentDate, "default");
const sendEmailPublicServiceMock = jest.spyOn(
  emailClient,
  "sendEmailPublicService"
);
const mockCurrentDate = "2023-12-28";

describe("directToPublicService", () => {
  beforeEach(() => {
    const mockSupportRequest = {
      zendeskTicketId: 123123123 as unknown as bigint,
    } as SupportRequests;
    const mockMsrZendeskTicket = {
      id: 123412341234 as unknown as bigint,
      encoded_id: "ABC-123",
    } as ZendeskTicket;
    const mockMsrZendeskUser = {
      name: "Teste MSR",
      email: "test@email.com",
    } as ZendeskUser;
    prismaMock.supportRequests.update.mockResolvedValue(mockSupportRequest);
    updateTicketMock.mockResolvedValueOnce(mockMsrZendeskTicket);
    getCurrentDateMock.mockImplementation(() => mockCurrentDate);
    getUserMock.mockResolvedValue(mockMsrZendeskUser);
    sendEmailPublicServiceMock.mockResolvedValueOnce(true);
  });

  it("should throw an error if no msr is found in Zendesk", async () => {
    getUserMock.mockResolvedValueOnce(null);

    await expect(directToPublicService(2)).rejects.toThrow(
      "Couldn't fetch msr from zendesk"
    );
  });

  it("should update support request with correct params", async () => {
    await directToPublicService(2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.supportRequests.update).toHaveBeenCalledWith({
      where: {
        supportRequestId: 2,
      },
      data: {
        status: "public_service",
        SupportRequestStatusHistory: {
          create: {
            status: "public_service",
          },
        },
      },
      select: {
        zendeskTicketId: true,
        msrId: true,
      },
    });
  });

  it("should call updateTicket with correct public service ticket", async () => {
    await directToPublicService(2);
    const publicServiceTicket = {
      id: 123123123,
      status: "pending",
      assignee_id: AGENT.id,
      custom_fields: [
        {
          id: 360014379412,
          value: "encaminhamento__realizado_para_serviço_público",
        },
        {
          id: 360017432652,
          value: "2023-12-28",
        },
      ],
    };
    expect(updateTicketMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(publicServiceTicket)
    );
    expect(updateTicketMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        comment: expect.objectContaining({
          public: false,
          body: "Não encontramos uma voluntária próxima disponível e MSR foi encaminhada para serviço público.",
        }),
      })
    );
  });

  it("should call sendEmailPublicService with correct params", async () => {
    await directToPublicService(2);
    expect(sendEmailPublicServiceMock).toHaveBeenNthCalledWith(
      1,
      "test@email.com",
      "Teste MSR",
      "ABC-123"
    );
  });
});
