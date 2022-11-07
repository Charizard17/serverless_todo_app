import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { generateUploadUrl } from "../../businessLogic/ToDo";
import { createLogger } from "../../utils/logger";

const myLogger = createLogger("todoAccess");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  const URL = await generateUploadUrl(todoId);

  myLogger.info("generateUploadUrlHandler", { params: URL });

  return {
    statusCode: 202,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      uploadUrl: URL,
    }),
  };
};
