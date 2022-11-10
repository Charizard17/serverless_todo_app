import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

export function getUserId(event: APIGatewayProxyEvent): string {
  const authHeader = event.headers.Authorization;
  const authSplit = authHeader.split(" ");
  const userId = authSplit[1];

  return parseUserId(userId);
}
