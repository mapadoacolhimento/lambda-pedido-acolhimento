import { verify } from "jsonwebtoken";
import type {
  Handler,
  Context,
  APIGatewayRequestAuthorizerEventV2,
  APIGatewayAuthorizerCallback,
} from "aws-lambda";
import { denyPolicy, allowPolicy } from "./utils";

const auth: Handler = (
  event: APIGatewayRequestAuthorizerEventV2,
  _context: Context,
  callback: APIGatewayAuthorizerCallback,
) => {
  // console.log("Received event", JSON.stringify(event, null, 2));

  const [authorization] = event.identitySource;
  if (!authorization) {
    console.error(`[auth] - No auth, deny auth`);
    return callback(null, denyPolicy("anonymous", event.routeArn));
  }

  // remove the 'Bearer ' prefix from the auth token
  const token = authorization.replace(/Bearer /g, "");
  if (!token) {
    console.error(`[auth] - No token, deny auth`);
    return callback(null, denyPolicy("anonymous", event.routeArn));
  }

  const secret = process.env["JWT_SECRET"] || "";

  // verifies secret and checks exp
  verify(token, secret, (err, verified) => {
    if (err) {
      console.error("[auth] JWT Error", err, err?.stack);
      return callback(null, denyPolicy("anonymous", event.routeArn));
    }
    return callback(
      null,
      allowPolicy(verified?.sub?.toString() || "", event.routeArn)
    );
  });
};

export default auth;
