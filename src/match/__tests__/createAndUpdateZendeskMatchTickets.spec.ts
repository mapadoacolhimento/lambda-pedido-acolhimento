import type { Volunteers } from "@prisma/client";
import createAndUpdateZendeskMatchTickets from "../createAndUpdateZendeskMatchTickets";
import type { SupportRequest, ZendeskTicket, ZendeskUser } from "../../types";

import * as zendeskClient from "../../zendeskClient";
import * as emailClient from "../../emailClient";
import * as getCurrentDate from "../../utils/getCurrentDate";
import { prismaMock } from "../../setupTests";
import { AGENT, TRANSACTIONAL_EMAIL_IDS } from "../../constants";

const getCurrentDateMock = jest.spyOn(getCurrentDate, "default");
const createTicketMock = jest.spyOn(zendeskClient, "createTicket");
const updateTicketMock = jest.spyOn(zendeskClient, "updateTicket");
const getUserMock = jest.spyOn(zendeskClient, "getUser");
const sendEmailToMsrMock = jest.spyOn(emailClient, "sendEmailToMsr");
const sendEmailToVolunteerMock = jest.spyOn(
  emailClient,
  "sendEmailToVolunteer"
);
jest.spyOn(global.Math, "random").mockReturnValue(0.7);

const mockVolunteerZendeskTicket = {
  id: 123123123 as unknown as bigint,
  encoded_id: "EFG-456",
} as ZendeskTicket;
const mockMsrZendeskTicket = {
  id: 123412341234 as unknown as bigint,
  encoded_id: "ABC-123",
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
  phone: "11911091113",
  registrationNumber: "123123",
  lastName: "Sobrenome",
  email: "teste@voluntaria.com",
} as Volunteers;
const mockMsrFromZendesk = {
  id: 5 as unknown as bigint,
  name: "Teste MSR",
  email: "teste@msr.com",
} as ZendeskUser;
const mockCurrentDate = "2023-12-28";

describe("createAndUpdateZendeskMatchTickets", () => {
  getCurrentDateMock.mockImplementation(() => mockCurrentDate);
  sendEmailToMsrMock.mockResolvedValueOnce(true);
  sendEmailToVolunteerMock.mockResolvedValueOnce(true);

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
    const legalSupportRequest = {
      ...baseSupportRequestPayload,
      supportType: "legal" as const,
    };

    beforeEach(() => {
      getUserMock.mockResolvedValueOnce(mockMsrFromZendesk);
      prismaMock.volunteers.findUnique.mockResolvedValueOnce(
        mockVolunteerFromDB
      );
      createTicketMock.mockResolvedValueOnce(mockVolunteerZendeskTicket);
      updateTicketMock.mockResolvedValueOnce(mockMsrZendeskTicket);
      sendEmailToMsrMock.mockResolvedValueOnce(true);
      sendEmailToVolunteerMock.mockResolvedValueOnce(true);
    });

    it("should return correct volunteer zendesk ticket id", async () => {
      const volunteerZendeskTicketId = await createAndUpdateZendeskMatchTickets(
        legalSupportRequest,
        mockVolunteerId
      );
      expect(volunteerZendeskTicketId).toStrictEqual(123123123);
    });

    it("should create a volunteer ticket with correct params", async () => {
      const volunteerTicket = {
        external_id: 5,
        requester_id: 3,
        submitter_id: AGENT.id,
        assignee_id: AGENT.id,
        status: "pending",
        subject: "[Advogada] Teste Voluntária acolhe Teste MSR",
        organization_id: 360269610652,
        comment: {
          body: "Voluntária recebeu um pedido de acolhimento de Teste MSR",
          public: false,
        },
        custom_fields: [
          {
            id: 360016681971,
            value: "Teste MSR",
          },
          {
            id: 360016631632,
            value: "https://meudominio.zendesk.com/agent/tickets/1234",
          },
          {
            id: 360014379412,
            value: "encaminhamento__realizado",
          },
          {
            id: 360017432652,
            value: "2023-12-28",
          },
        ],
      };
      await createAndUpdateZendeskMatchTickets(
        legalSupportRequest,
        mockVolunteerId
      );
      expect(createTicketMock).toHaveBeenNthCalledWith(1, volunteerTicket);
    });

    it("should update msr ticket with correct params", async () => {
      const msrTicket = {
        id: 1234,
        status: "pending",
        assignee_id: AGENT.id,
        custom_fields: [
          {
            id: 360016631592,
            value: "Teste Voluntária",
          },
          {
            id: 360014379412,
            value: "encaminhamento__realizado",
          },
          {
            id: 360016631632,
            value: "https://meudominio.zendesk.com/agent/tickets/123123123",
          },
          {
            id: 360017432652,
            value: "2023-12-28",
          },
        ],
        comment: {
          body: "MSR foi encaminhada para Teste Voluntária",
          public: false,
        },
      };
      await createAndUpdateZendeskMatchTickets(
        legalSupportRequest,
        mockVolunteerId
      );
      expect(updateTicketMock).toHaveBeenNthCalledWith(1, msrTicket);
    });

    it("should call send email to MSR with correct params", async () => {
      await createAndUpdateZendeskMatchTickets(
        legalSupportRequest,
        mockVolunteerId
      );
      expect(sendEmailToMsrMock).toHaveBeenCalledWith(
        {
          ...mockMsrFromZendesk,
          encoded_id: "ABC-123",
        },
        mockVolunteerFromDB,
        TRANSACTIONAL_EMAIL_IDS["legal"]["msr"]
      );
    });

    it("should call send email to volunteer with correct params", async () => {
      await createAndUpdateZendeskMatchTickets(
        legalSupportRequest,
        mockVolunteerId
      );
      expect(sendEmailToVolunteerMock).toHaveBeenCalledWith(
        {
          ...mockVolunteerFromDB,
          encoded_id: "EFG-456",
        },
        mockMsrFromZendesk.name,
        "legal"
      );
    });
  });

  describe("Psychological", () => {
    beforeEach(() => {
      getUserMock.mockResolvedValueOnce(mockMsrFromZendesk);
      prismaMock.volunteers.findUnique.mockResolvedValueOnce(
        mockVolunteerFromDB
      );
      createTicketMock.mockResolvedValueOnce(mockVolunteerZendeskTicket);
      updateTicketMock.mockResolvedValueOnce(mockMsrZendeskTicket);
      sendEmailToMsrMock.mockResolvedValueOnce(true);
      sendEmailToVolunteerMock.mockResolvedValueOnce(true);
    });

    it("should return correct volunteer zendesk ticket id", async () => {
      const volunteerZendeskTicketId = await createAndUpdateZendeskMatchTickets(
        baseSupportRequestPayload,
        mockVolunteerId
      );
      expect(volunteerZendeskTicketId).toStrictEqual(123123123);
    });

    it("should create volunteer ticket with correct params", async () => {
      const volunteerTicket = {
        subject: "[Psicóloga] Teste Voluntária acolhe Teste MSR",
        organization_id: 360282119532,
      };
      await createAndUpdateZendeskMatchTickets(
        baseSupportRequestPayload,
        mockVolunteerId
      );
      expect(createTicketMock).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining(volunteerTicket)
      );
    });

    it("should update msr ticket with correct params", async () => {
      const msrTicket = {
        id: 1234,
        status: "pending",
        assignee_id: AGENT.id,
        custom_fields: [
          {
            id: 360016631592,
            value: "Teste Voluntária",
          },
          {
            id: 360014379412,
            value: "encaminhamento__realizado",
          },
          {
            id: 360016631632,
            value: "https://meudominio.zendesk.com/agent/tickets/123123123",
          },
          {
            id: 360017432652,
            value: "2023-12-28",
          },
        ],
        comment: {
          body: "MSR foi encaminhada para Teste Voluntária",
          public: false,
        },
      };
      await createAndUpdateZendeskMatchTickets(
        baseSupportRequestPayload,
        mockVolunteerId
      );
      expect(updateTicketMock).toHaveBeenNthCalledWith(1, msrTicket);
    });

    it("should call send email to MSR with correct params", async () => {
      await createAndUpdateZendeskMatchTickets(
        baseSupportRequestPayload,
        mockVolunteerId
      );
      expect(sendEmailToMsrMock).toHaveBeenCalledWith(
        {
          ...mockMsrFromZendesk,
          encoded_id: "ABC-123",
        },
        mockVolunteerFromDB,
        TRANSACTIONAL_EMAIL_IDS["psychological"]["msr"]
      );
    });

    it("should call send email to volunteer with correct params", async () => {
      await createAndUpdateZendeskMatchTickets(
        baseSupportRequestPayload,
        mockVolunteerId
      );
      expect(sendEmailToVolunteerMock).toHaveBeenCalledWith(
        {
          ...mockVolunteerFromDB,
          encoded_id: "EFG-456",
        },
        mockMsrFromZendesk.name,
        "psychological"
      );
    });
  });
});
