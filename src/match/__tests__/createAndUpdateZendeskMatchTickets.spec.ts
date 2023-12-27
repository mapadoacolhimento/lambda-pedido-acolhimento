import type { Volunteers } from "@prisma/client";
import createAndUpdateZendeskMatchTickets from "../createAndUpdateZendeskMatchTickets";
import type { SupportRequest, ZendeskTicket, ZendeskUser } from "../../types";

import * as zendeskClient from "../../zendeskClient";
import * as getAgent from "../../utils/getAgent";
import { prismaMock } from "../../setupTests";

const getAgentMock = jest.spyOn(getAgent, "default");
const createTicketMock = jest.spyOn(zendeskClient, "createTicket");
// const updateTicketMock = jest.spyOn(zendeskClient, "updateTicket");
const getUserMock = jest.spyOn(zendeskClient, "getUser");

const mockAgentNumber = 1;
const mockVolunteerTicket = {
  id: 123123123 as unknown as bigint,
} as ZendeskTicket;
const baseSupportRequestPayload = {
  msrId: 123 as unknown as bigint,
  zendeskTicketId: 1234 as unknown as bigint,
  supportType: "psychological",
} as SupportRequest;
const mockVolunteerId = 2;
const mockVolunteerFromDB = {
  zendeskUserId: 3 as unknown as bigint,
  firstName: "Teste Voluntária",
} as Volunteers;
const mockMsrFromZendesk = {
  id: 5 as unknown as bigint,
  name: "Teste MSR",
} as ZendeskUser;

describe("createAndUpdateZendeskMatchTickets", () => {
  getAgentMock.mockImplementation(() => mockAgentNumber);

  it("should throw an error if no volunteer is found", async () => {
    getUserMock.mockResolvedValueOnce({} as ZendeskUser);
    prismaMock.volunteers.findUnique.mockResolvedValueOnce(null);

    await expect(
      createAndUpdateZendeskMatchTickets(
        baseSupportRequestPayload,
        mockVolunteerId
      )
    ).rejects.toThrow("Couldn't fetch volunteer from db or msr from zendesk");
  });

  it("should throw an error if no msr is found", async () => {
    getUserMock.mockResolvedValueOnce(null);
    prismaMock.volunteers.findUnique.mockResolvedValueOnce({} as Volunteers);

    await expect(
      createAndUpdateZendeskMatchTickets(
        baseSupportRequestPayload,
        mockVolunteerId
      )
    ).rejects.toThrow("Couldn't fetch volunteer from db or msr from zendesk");
  });

  it("should throw an error if no volunteer match ticket was created", async () => {
    getUserMock.mockResolvedValueOnce(mockMsrFromZendesk);
    prismaMock.volunteers.findUnique.mockResolvedValueOnce(mockVolunteerFromDB);
    createTicketMock.mockResolvedValueOnce(null);

    await expect(
      createAndUpdateZendeskMatchTickets(
        baseSupportRequestPayload,
        mockVolunteerId
      )
    ).rejects.toThrow("Couldn't create volunteer match ticket");
  });

  describe("Legal", () => {
    beforeEach(() => {
      getUserMock.mockResolvedValueOnce(mockMsrFromZendesk);
      prismaMock.volunteers.findUnique.mockResolvedValueOnce(
        mockVolunteerFromDB
      );
      createTicketMock.mockResolvedValueOnce(mockVolunteerTicket);
    });
    it("should create a volunteer ticket with correct params", () => {});
    it("should update msr ticket with correct params", () => {});
  });

  describe("Psychological", () => {
    beforeEach(() => {
      getUserMock.mockResolvedValueOnce(mockMsrFromZendesk);
      prismaMock.volunteers.findUnique.mockResolvedValueOnce(
        mockVolunteerFromDB
      );
      createTicketMock.mockResolvedValueOnce(mockVolunteerTicket);
    });
    it("should create volunteer ticket with correct params", () => {});
    it("should update msr ticket with correct params", () => {});
  });
});
