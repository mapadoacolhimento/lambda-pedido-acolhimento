import type { APIGatewayAuthorizerResult, Statement } from "aws-lambda";

export const denyPolicy = (
  principalId: string,
  resource: string,
): APIGatewayAuthorizerResult => {
  return generatePolicy("Deny", principalId, resource);
};

export const allowPolicy = (
  principalId: string,
  resource: string,
): APIGatewayAuthorizerResult => {
  return generatePolicy("Allow", principalId, resource);
};

export const generatePolicy = (
  effect: string,
  principalId: string,
  resource: string,
): APIGatewayAuthorizerResult => {
  const statementOne: Statement = {
    Action: "execute-api:Invoke", // default action
    Effect: effect,
    Resource: resource,
  };

  const authResponse: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: "2012-10-17", // default version
      Statement: [statementOne],
    },
  };

  return authResponse;
};
