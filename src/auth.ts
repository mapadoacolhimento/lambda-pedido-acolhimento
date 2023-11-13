import { verify } from "jsonwebtoken";
import type {
  Handler,
  Context,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerCallback,
  APIGatewayAuthorizerResult,
  Statement,
} from "aws-lambda";

const denyPolicy = function (
  principalId: string,
  resource: string,
): APIGatewayAuthorizerResult {
  return generatePolicy("Deny", principalId, resource);
};

const allowPolicy = function (
  principalId: string,
  resource: string,
): APIGatewayAuthorizerResult {
  return generatePolicy("Allow", principalId, resource);
};

const generatePolicy = function (
  effect: string,
  principalId: string,
  resource: string,
): APIGatewayAuthorizerResult {
  let authResponse: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: "2012-10-17", // default version
      Statement: [],
    },
  };

  if (effect && resource) {
    const statementOne: Statement = {
      Action: "execute-api:Invoke", // default action
      Effect: effect,
      Resource: resource,
    };

    authResponse = {
      ...authResponse,
      policyDocument: {
        ...authResponse.policyDocument,
        Statement: [statementOne],
      },
    };
  }

  return authResponse;
};

const auth: Handler = (
  event: APIGatewayTokenAuthorizerEvent,
  _context: Context,
  callback: APIGatewayAuthorizerCallback,
) => {
  console.log("Received event", JSON.stringify(event, null, 2));

  // remove the 'Bearer ' prefix from the auth token
  const token = event.authorizationToken.replace(/Bearer /g, "");

  if (!token) return callback(null, denyPolicy("anonymous", event.methodArn));

  const secret = process.env["JWT_SECRET"] || "";

  // verifies secret and checks exp
  verify(token, secret, (err, verified) => {
    if (err) {
      console.error("JWT Error", err, err?.stack);
      return callback(null, denyPolicy("anonymous", event.methodArn));
    }
    return callback(
      null,
      allowPolicy(verified?.sub?.toString() || "", event.methodArn),
    );
  });
};

export default auth;
