import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { attachUrl, getPresignedUrl } from "../../businessLogic/todos";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";

const myLogger = createLogger("generateUploadUrl");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  myLogger.info("Processing event: ", { event: event });

  const todoId = event.pathParameters.todoId;
  const presignedUrl = await getPresignedUrl(todoId);
  const userId = getUserId(event);

  try {
    await attachUrl(userId, todoId);
    myLogger.info("generateUploadUrl todoId and userId", todoId, userId);
    myLogger.info("generateUploadUrl presignedUrl:", presignedUrl);
  } catch (e) {
    myLogger.error("An error is occured on attaching url: ", {
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

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      uploadUrl: presignedUrl,
    }),
  };
};
