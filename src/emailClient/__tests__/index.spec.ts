import {
  sendEmailPublicService,
  sendEmailSocialWorker,
  sendEmailToMsr,
  sendEmailToVolunteer,
} from "..";
import * as sendEmail from "../../emailClient/sendEmail";

const sendEmailMock = jest.spyOn(sendEmail, "default");
const msr = {
  name: "teste msr",
  email: "teste@msr.com",
  zendeskTicketId: 123123 as unknown as bigint,
};
const volunteer = {
  firstName: "Voluntaria",
  lastName: "Teste",
  phone: "11911091199",
  registrationNumber: "123123",
  email: "teste@voluntaria.com",
  zendeskTicketId: 123123 as unknown as bigint,
};

describe("sendEmailPublicService", () => {
  beforeEach(() => {
    sendEmailMock.mockResolvedValueOnce(true);
  });
  it("should call sendEmail with correct params", async () => {
    const zendeskTicketId = "123123";
    const res = await sendEmailPublicService(
      "test@msr.com",
      "teste MSR",
      zendeskTicketId
    );
    expect(res).toStrictEqual(true);
    expect(sendEmailMock).toHaveBeenNthCalledWith(
      1,
      "test@msr.com",
      "clv43j25d00b0y19vj7x8qdxy",
      {
        msr_first_name: "Teste",
        msr_zendesk_ticket_id: zendeskTicketId,
      }
    );
  });
});

describe("sendEmailSocialWorker", () => {
  beforeEach(() => {
    sendEmailMock.mockResolvedValueOnce(true);
  });
  it("should call sendEmail with correct params", async () => {
    const zendeskTicketId = "123123";
    const res = await sendEmailSocialWorker(
      "test@msr.com",
      "teste MSR",
      zendeskTicketId
    );
    expect(res).toStrictEqual(true);
    expect(sendEmailMock).toHaveBeenNthCalledWith(
      1,
      "test@msr.com",
      "clv4a8qf1004meoqo89fcfjy7",
      {
        msr_first_name: "Teste",
        msr_zendesk_ticket_id: zendeskTicketId,
      }
    );
  });
});

describe("sendEmailToMsr", () => {
  beforeEach(() => {
    sendEmailMock.mockResolvedValueOnce(true);
  });
  describe("Psychological", () => {
    it("should call sendEmail with correct params", async () => {
      const res = await sendEmailToMsr(
        msr,
        volunteer,
        "clv4977jg01a7hlj1twd22zq1"
      );
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@msr.com",
        "clv4977jg01a7hlj1twd22zq1",
        {
          msr_first_name: "Teste",
          volunteer_name: "Voluntaria Teste",
          volunteer_phone: "11911091199",
          lawyer_phone: "11911091199",
          volunteer_registration_number: "123123",
          msr_zendesk_ticket_id: msr.zendeskTicketId.toString(),
        }
      );
    });
  });
  describe("Legal", () => {
    it("should call sendEmail with correct params", async () => {
      const res = await sendEmailToMsr(
        msr,
        volunteer,
        "clv43f8gd02evj3woijkqcgng"
      );
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@msr.com",
        "clv43f8gd02evj3woijkqcgng",
        {
          msr_first_name: "Teste",
          volunteer_name: "Voluntaria Teste",
          volunteer_phone: "11911091199",
          lawyer_phone: "11911091199",
          volunteer_registration_number: "123123",
          msr_zendesk_ticket_id: msr.zendeskTicketId.toString(),
        }
      );
    });
  });
});

describe("sendEmailToVolunteer", () => {
  beforeEach(() => {
    sendEmailMock.mockResolvedValueOnce(true);
  });
  describe("Psychological", () => {
    it("should call sendEmail with correct params", async () => {
      const res = await sendEmailToVolunteer(
        volunteer,
        msr.name,
        "psychological"
      );
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@voluntaria.com",
        "clv5c4mim008rjwf7bqgvk2ga",
        {
          volunteer_first_name: "Voluntaria",
          msr_first_name: "Teste",
          volunteer_phone: "11911091199",
          volunteer_zendesk_ticket_id: volunteer.zendeskTicketId.toString(),
        }
      );
    });
  });
  describe("Legal", () => {
    it("should call sendEmail with correct params", async () => {
      const res = await sendEmailToVolunteer(volunteer, msr.name, "legal");
      expect(res).toStrictEqual(true);
      expect(sendEmailMock).toHaveBeenNthCalledWith(
        1,
        "teste@voluntaria.com",
        "clv43jw1t00yj79ezuug2kh6z",
        {
          volunteer_first_name: "Voluntaria",
          msr_first_name: "Teste",
          volunteer_phone: "11911091199",
          volunteer_zendesk_ticket_id: volunteer.zendeskTicketId.toString(),
        }
      );
    });
  });
});
