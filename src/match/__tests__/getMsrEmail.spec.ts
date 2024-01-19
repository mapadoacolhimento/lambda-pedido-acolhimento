import getMsrEmail from "../getMsrEmail";

describe("getMsrEmail", () => {
  describe("Legal", () => {
    let email = {} as Record<string, unknown>;
    beforeAll(() => {
      email = getMsrEmail({
        volunteer: {
          phone: "+5511988887777",
          registrationNumber: "123123",
          firstName: "Teste Voluntária",
        },
        agent: 377511446392,
        msr: {
          email: "test+jur@email.com",
          name: "Teste Msr Jur",
          supportType: "legal",
        },
      });
    });
    it("should return the correct comment payload", () => {
      expect(email).toStrictEqual(
        expect.objectContaining({
          author_id: 377511446392,
          public: false,
        })
      );
    });
    it("should contain correct msr name", () => {
      expect(email["html_body"]).toContain("Teste Msr Jur");
    });
    it("should contain correct volunteer occupation", () => {
      expect(email["html_body"]).toContain("Advogada");
    });
    it("should contain correct volunteer name", () => {
      expect(email["html_body"]).toContain("Teste Voluntária");
    });
    it("should contain correct volunteer phone", () => {
      expect(email["html_body"]).toContain("+5511988887777");
    });
    it("should contain correct volunteer registry type", () => {
      expect(email["html_body"]).toContain("OAB");
    });
    it("should contain correct volunteer registration number", () => {
      expect(email["html_body"]).toContain("123123");
    });
    it("should contain correct agent name", () => {
      expect(email["html_body"]).toContain("Gabriela");
    });
    it("should contain survey link", () => {
      expect(email["html_body"]).toContain(
        "https://qualtrics.com/form?user_id=NTdmNWE4NzE2NzgwZGY5YTllZTA0NmQxYjA0NGE3YmMxOWQxOGI2MThmNTcxZjlkNjhhNDcxNWY0ZmQ2YWU1YQ=="
      );
    });
  });
  describe("Psychological", () => {
    let email = {} as Record<string, unknown>;
    beforeAll(() => {
      email = getMsrEmail({
        volunteer: {
          phone: "+5511988887779",
          registrationNumber: "1231234",
          firstName: "Teste Voluntária",
        },
        agent: 377577169651,
        msr: {
          email: "test+psi@email.com",
          name: "Teste Msr Psi",
          supportType: "psychological",
        },
      });
    });
    it("should return the correct comment payload", () => {
      expect(email).toStrictEqual(
        expect.objectContaining({
          author_id: 377577169651,
          public: false,
        })
      );
    });
    it("should contain correct msr name", () => {
      expect(email["html_body"]).toContain("Teste Msr Psi");
    });
    it("should contain correct volunteer occupation", () => {
      expect(email["html_body"]).toContain("Psicóloga");
    });
    it("should contain correct volunteer name", () => {
      expect(email["html_body"]).toContain("Teste Voluntária");
    });
    it("should contain correct volunteer phone", () => {
      expect(email["html_body"]).toContain("+5511988887779");
    });
    it("should contain correct volunteer registry type", () => {
      expect(email["html_body"]).toContain("CRP");
    });
    it("should contain correct volunteer registration number", () => {
      expect(email["html_body"]).toContain("1231234");
    });
    it("should contain correct agent name", () => {
      expect(email["html_body"]).toContain("Ana");
    });
    it("should contain survey link", () => {
      expect(email["html_body"]).toContain(
        "https://qualtrics.com/form?user_id=NWEwMWVkMTk0MDExYTJjZTYxMTczMWY0M2I2MzY1OTcyODAyOWQzZjE1NTRmNTM1NjVmMTI2MGVmYjExMWIzMA=="
      );
    });
  });
  describe("Public Service", () => {
    let email = {} as Record<string, unknown>;
    beforeAll(() => {
      email = getMsrEmail({
        agent: 377577169651,
        msr: {
          email: "test+pub@email.com",
          name: "Teste Msr Pub",
          supportType: "psychological",
        },
      });
    });
    it("should return the correct comment payload", () => {
      expect(email).toStrictEqual(
        expect.objectContaining({
          author_id: 377577169651,
          public: false,
        })
      );
    });
    it("should contain correct msr name", () => {
      expect(email["html_body"]).toContain("Teste Msr Pub");
    });
    it("should mention public service", () => {
      expect(email["html_body"]).toContain("serviços públicos");
    });
    it("should contain correct agent name", () => {
      expect(email["html_body"]).toContain("Ana");
    });
    it("should contain survey link", () => {
      expect(email["html_body"]).toContain(
        "https://qualtrics.com/form?user_id=MWY0ZjAyMmQ1YjU5YTc1MzE1MWExNTJjOGViZDlmMWNkMTc3MTRhOTBlN2NhN2MzNjM5NGFhMzA4MjQwZGI5Mw=="
      );
    });
  });
});
