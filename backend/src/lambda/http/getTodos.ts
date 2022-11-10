import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { parseUserId } from "../../auth/utils";
import { createLogger } from "../../utils/logger";
import { getTodos } from "../../businessLogic/todos";

const myLogger = createLogger("getTodos");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  myLogger.info("Processing event: ", { event: event });
  const authHeader = event.headers.Authorization;
  const authSplit = authHeader.split(" ");
  const userId = parseUserId(authSplit[1]);

  myLogger.info("getTodos userId", userId);

  try {
    const result = await getTodos(userId);
    myLogger.info("Result: ", { result: result });
    const items = result.Items;
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        items,
      }),
    };
  } catch (e) {
    myLogger.error("An error occured on getting todos: ", { error: e.message });
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "",
    };
  }
};
