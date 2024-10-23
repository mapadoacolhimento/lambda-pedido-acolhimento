import type { SupportRequests } from "@prisma/client";

import * as zendeskClient from "../../zendeskClient";
import * as emailClient from "../../emailClient";
import * as getCurrentDate from "../../utils/getCurrentDate";
import type { ZendeskTicket, ZendeskUser } from "../../types";
import { AGENT } from "../../constants";

import { prismaMock } from "../../setupTests";
import directToQueue from "../directToQueue";

const updateTicketMock = jest.spyOn(zendeskClient, "updateTicket");
const getUserMock = jest.spyOn(zendeskClient, "getUser");
const getCurrentDateMock = jest.spyOn(getCurrentDate, "default");
const sendEmailQueueMock = jest.spyOn(emailClient, "sendEmailQueue");
const mockCurrentDate = "2023-12-28";

describe("directToQueue", () => {
  beforeEach(() => {
    const mockSupportRequest = {
      zendeskTicketId: 123123123 as unknown as bigint,
    } as SupportRequests;
    const mockMsrZendeskTicket = {
      id: 123412341234 as unknown as bigint,
    } as ZendeskTicket;
    const mockMsrZendeskUser = {
      name: "Teste MSR",
      email: "test@email.com",
    } as ZendeskUser;
    prismaMock.supportRequests.update.mockResolvedValue(mockSupportRequest);
    updateTicketMock.mockResolvedValueOnce(mockMsrZendeskTicket);
    getCurrentDateMock.mockImplementation(() => mockCurrentDate);
    getUserMock.mockResolvedValue(mockMsrZendeskUser);
    sendEmailQueueMock.mockResolvedValueOnce(true);
  });

  it("should throw an error if no msr is found in Zendesk", async () => {
    getUserMock.mockResolvedValueOnce(null);

    await expect(directToQueue(2)).rejects.toThrow(
      "Couldn't fetch msr from zendesk"
    );
  });

  it("should update support request with correct params", async () => {
    await directToQueue(2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaMock.supportRequests.update).toHaveBeenCalledWith({
      where: {
        supportRequestId: 2,
      },
      data: {
        status: "waiting_for_match",
        SupportRequestStatusHistory: {
          create: {
            status: "waiting_for_match",
          },
        },
      },
      select: {
        zendeskTicketId: true,
        msrId: true,
      },
    });
  });

  it("should call updateTicket with correct ticket", async () => {
    await directToQueue(2);
    const ticket = {
      id: 123123123,
      status: "pending",
      assignee_id: AGENT.id,
      custom_fields: [
        {
          id: 360014379412,
          value: "aguardando_match__sem_prioridade",
        },
        {
          id: 360017432652,
          value: "2023-12-28",
        },
      ],
    };
    expect(updateTicketMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(ticket)
    );
    expect(updateTicketMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        comment: expect.objectContaining({
          public: false,
          body: "Não encontramos uma voluntária próxima disponível e MSR foi encaminhada para a fila do Match Diário.",
        }),
      })
    );
  });

  it("should call sendEmailQueue with correct params", async () => {
    await directToQueue(2);
    expect(sendEmailQueueMock).toHaveBeenNthCalledWith(
      1,
      "test@email.com",
      "Teste MSR",
      "123123123"
    );
  });
});
