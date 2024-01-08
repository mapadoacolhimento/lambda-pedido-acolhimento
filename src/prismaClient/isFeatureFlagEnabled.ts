import prismaClient from "./";

export default async function isFeatureFlagEnabled(
  featureFlagName: string
): Promise<boolean> {
  const isEnabled = await prismaClient.featureFlag.findUnique({
    where: {
      featureName: featureFlagName,
    },
    select: {
      featureEnabled: true,
    },
  });

  return isEnabled ? isEnabled.featureEnabled : false;
}
