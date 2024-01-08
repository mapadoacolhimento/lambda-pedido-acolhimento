import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export default client;

export { default as isFeatureFlagEnabled } from "./isFeatureFlagEnabled";
