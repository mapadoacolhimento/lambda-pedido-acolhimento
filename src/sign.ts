import { signToken } from "./utils";
import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";

const sign = (
  _event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: signToken(context.functionName),
    }),
  });
};

export default sign;
