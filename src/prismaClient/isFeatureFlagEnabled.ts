import { prisma } from "./db";

export default async function isFeatureFlagEnabled(
  featureFlagName: string
): Promise<boolean> {
  const isEnabled = await prisma.featureFlag.findUnique({
    where: { featureName: featureFlagName },
    select: { featureEnabled: true },
  });
  return isEnabled ? isEnabled.featureEnabled : false;
}
