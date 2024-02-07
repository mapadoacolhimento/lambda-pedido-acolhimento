import type { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import prisma from "./prismaClient";

jest.mock("./prismaClient", () => ({
  ...jest.requireActual("./prismaClient"),
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

process.env["ZENDESK_SUBDOMAIN"] = "https://meudominio.zendesk.com";
process.env["SECRET_IV"] = "secretIv";
process.env["SECRET_KEY"] = "secretKey";
process.env["SURVEY_LINK"] = "https://qualtrics.com/form";
process.env["CAL_LINK"] = "https://cal.com/xxxx";
process.env["ENCRYPTION_METHOD"] = "aes-256-cbc";
