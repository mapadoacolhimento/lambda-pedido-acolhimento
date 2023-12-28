import type { SupportRequests } from "@prisma/client";
import directToPublicService from "../directToPublicService";

import * as zendeskClient from "../../zendeskClient";
import * as getAgent from "../../utils/getAgent";
import * as getCurrentDate from "../../utils/getCurrentDate";
import type { ZendeskTicket } from "../../types";

import { prismaMock } from "../../setupTests";

const updateTicketMock = jest.spyOn(zendeskClient, "updateTicket");
const getAgentMock = jest.spyOn(getAgent, "default");
const getCurrentDateMock = jest.spyOn(getCurrentDate, "default");

const mockAgentNumber = 1;
const mockCurrentDate = "2023-12-28";

describe("directToPublicService", () => {
  getAgentMock.mockImplementation(() => mockAgentNumber);

  beforeEach(() => {
    const mockSupportRequest = {
      state: "SP",
      zendeskTicketId: 123123123 as unknown as bigint,
    } as SupportRequests;
    const mockMsrZendeskTicket = {
      id: 123412341234 as unknown as bigint,
    } as ZendeskTicket;
    prismaMock.supportRequests.update.mockResolvedValue(mockSupportRequest);
    updateTicketMock.mockResolvedValueOnce(mockMsrZendeskTicket);
    getCurrentDateMock.mockImplementation(() => mockCurrentDate);
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
        state: true,
        zendeskTicketId: true,
      },
    });
  });

  it("should call updateTicket with correct public service ticket", async () => {
    await directToPublicService(2);
    const publicServiceTicket = {
      id: 123123123,
      status: "pending",
      assignee_id: 1,
      custom_fields: [
        {
          id: 360021879791,
          value: "SP",
        },
        {
          id: 360014379412,
          value: "encaminhamento__realizado_para_serviço_público",
        },
        {
          id: 360017432652,
          value: "2023-12-28",
        },
      ],
      comment: {
        body: `Ticket da MSR foi atualizado após ela ser encaminhada para um serviço público`,
        author_id: 1,
        public: false,
      },
    };
    expect(updateTicketMock).toHaveBeenNthCalledWith(1, publicServiceTicket);
  });
});
