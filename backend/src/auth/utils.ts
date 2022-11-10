import { decode } from "jsonwebtoken";
import { JwtPayload } from "./JwtPayload";

export function parseUserId(userId: string): string {
  const decodedUserId = decode(userId) as JwtPayload;
  return decodedUserId.sub;
}
