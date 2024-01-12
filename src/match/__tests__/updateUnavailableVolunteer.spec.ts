import type { Volunteers } from "@prisma/client";
import * as zendeskClient from "../../zendeskClient";
import { prismaMock } from "../../setupTests";
import updateUnavailableVolunteer from "../updateUnavailableVolunteer";
import type { ZendeskUser } from "../../types";

const updateUserMock = jest.spyOn(zendeskClient, "updateUser");

const mockVolunteerId = 2;
const mockVolunteerFromDB = {
  zendeskUserId: 1 as unknown as bigint,
} as Volunteers;
const mockVolunteerFromDBNullZendeskUserId = {
  zendeskUserId: null,
} as Volunteers;
const mockVolunteerFromZendesk = {
  id: 5 as unknown as bigint,
  name: "Teste Voluntária",
  user_fields: {
    condition: "indisponivel_sem_vagas",
  },
} as ZendeskUser;

describe("updateUnavailableVolunteer", () => {
  it("should throw an error if volunteer has null zendesk_ticket_id", async () => {
    prismaMock.volunteers.update.mockResolvedValueOnce(
      mockVolunteerFromDBNullZendeskUserId
    );

    await expect(updateUnavailableVolunteer(mockVolunteerId)).rejects.toThrow(
      "Couldn't fetch volunteer from db"
    );
  });

  it("should throw an error if no volunteer was updated on Zendesk", async () => {
    prismaMock.volunteers.update.mockResolvedValueOnce(mockVolunteerFromDB);
    updateUserMock.mockResolvedValueOnce(null);

    await expect(updateUnavailableVolunteer(mockVolunteerId)).rejects.toThrow(
      "Couldn't update volunteer Zendesk status"
    );
  });

  it("should call updateUser function with correct payload", async () => {
    prismaMock.volunteers.update.mockResolvedValueOnce(mockVolunteerFromDB);
    updateUserMock.mockResolvedValueOnce(mockVolunteerFromZendesk);
    await updateUnavailableVolunteer(mockVolunteerId);

    expect(updateUserMock).toHaveBeenCalledWith({
      id: mockVolunteerFromDB.zendeskUserId,
      user_fields: { condition: "indisponivel_sem_vagas" },
    });
  });

  it("should update volunteer zendesk status to indisponivel_sem_vagas", async () => {
    prismaMock.volunteers.update.mockResolvedValueOnce(mockVolunteerFromDB);
    updateUserMock.mockResolvedValueOnce(mockVolunteerFromZendesk);

    const updatedVolunteer = await updateUnavailableVolunteer(mockVolunteerId);

    expect(updatedVolunteer).toStrictEqual(mockVolunteerFromZendesk);
  });
});
