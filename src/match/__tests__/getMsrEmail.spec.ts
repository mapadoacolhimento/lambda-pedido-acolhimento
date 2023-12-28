import getMsrEmail from "../getMsrEmail";

describe("getMsrEmail", () => {
  describe("Legal", () => {
    let email = "";
    beforeAll(() => {
      email = getMsrEmail({
        volunteer: {
          phone: "+5511988887777",
          registrationNumber: "123123",
          firstName: "Teste Voluntária",
        },
        agent: 377511446392,
        msr: {
          name: "Teste Msr",
          supportType: "legal",
        },
      });
    });
    it("should contain correct msr name", () => {
      expect(email).toContain("Teste Msr");
    });
    it("should contain correct volunteer occupation", () => {
      expect(email).toContain("Advogada");
    });
    it("should contain correct volunteer name", () => {
      expect(email).toContain("Teste Voluntária");
    });
    it("should contain correct volunteer phone", () => {
      expect(email).toContain("+5511988887777");
    });
    it("should contain correct volunteer registry type", () => {
      expect(email).toContain("OAB");
    });
    it("should contain correct volunteer registration number", () => {
      expect(email).toContain("123123");
    });
    it("should contain correct agent name", () => {
      expect(email).toContain("Gabriela");
    });
  });
  describe("Psychological", () => {
    let email = "";
    beforeAll(() => {
      email = getMsrEmail({
        volunteer: {
          phone: "+5511988887779",
          registrationNumber: "1231234",
          firstName: "Teste Voluntária",
        },
        agent: 377577169651,
        msr: {
          name: "Teste Msr",
          supportType: "psychological",
        },
      });
    });
    it("should contain correct msr name", () => {
      expect(email).toContain("Teste Msr");
    });
    it("should contain correct volunteer occupation", () => {
      expect(email).toContain("Psicóloga");
    });
    it("should contain correct volunteer name", () => {
      expect(email).toContain("Teste Voluntária");
    });
    it("should contain correct volunteer phone", () => {
      expect(email).toContain("+5511988887779");
    });
    it("should contain correct volunteer registry type", () => {
      expect(email).toContain("CRP");
    });
    it("should contain correct volunteer registration number", () => {
      expect(email).toContain("1231234");
    });
    it("should contain correct agent name", () => {
      expect(email).toContain("Ana");
    });
  });
});
