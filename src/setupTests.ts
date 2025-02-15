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
process.env["CAL_LINK"] = "https://cal.com/xxxx";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;
