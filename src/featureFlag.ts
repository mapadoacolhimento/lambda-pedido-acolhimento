import prismaClient from "./prismaClient";
import { getErrorMessage } from "./utils";
import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";

const featureFlag = async (
  event: APIGatewayEvent,
  _context: Context,
  callback: APIGatewayProxyCallback
) => {
  try {
    const { queryStringParameters } = event;
    const featureFlagName = queryStringParameters
      ? queryStringParameters["name"]
      : null;

    if (!featureFlagName) {
      console.error(
        "[featureFlag] - 400: No feature flag name provided. Try again."
      );

      return callback(null, {
        statusCode: 400,
        body: "No feature flag name provided. Try again.",
      });
    }

    const isFeatureFlagEnabled = await prismaClient.featureFlag.findUnique({
      where: {
        feature_name: featureFlagName,
      },
      select: {
        feature_enabled: true,
      },
    });

    if (!isFeatureFlagEnabled) {
      return callback(null, {
        statusCode: 404,
        body: "No feature flag with this name was found.",
      });
    }

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        isFeatureFlagEnabled: isFeatureFlagEnabled.feature_enabled,
      }),
    });
  } catch (e) {
    const error = e as Record<string, unknown>;
    const errorMsg = getErrorMessage(error);

    console.error(`[featureFlag] - 500: ${errorMsg}`);

    return callback(null, {
      statusCode: 500,
      body: errorMsg,
    });
  }
};

export default featureFlag;
