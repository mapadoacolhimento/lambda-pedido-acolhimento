import { sign } from "jsonwebtoken";

export default function signToken(principalId: string) {
  const secret = process.env["JWT_SECRET"] || "";

  return sign({ sub: principalId }, secret, {
    // expiresIn: 3600, // expires in 1 hour
    expiresIn: 86400, // expires in 24 hours
  });
}
