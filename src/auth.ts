import { verify } from "jsonwebtoken";
import type {
  Handler,
  Context,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerCallback,
} from "aws-lambda";
import { denyPolicy, allowPolicy } from "./utils";

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
