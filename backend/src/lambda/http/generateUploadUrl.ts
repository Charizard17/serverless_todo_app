import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { generateUploadUrl } from "../../businessLogic/todos";
import { createLogger } from "../../utils/logger";

const myLogger = createLogger("generateUploadUrl");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  try {
    const URL = await generateUploadUrl(todoId);
    myLogger.info("generateUploadUrlHandler", { params: URL });

    return {
      statusCode: 202,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        uploadUrl: URL,
      }),
    };
  } catch (e) {
    myLogger.info("An error is occured when generating url: ", {
      error: e.message,
    });

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "",
    };
  }
};
