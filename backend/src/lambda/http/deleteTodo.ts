import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { createLogger } from "../../utils/logger";
import { deleteTodo } from "../../businessLogic/todos";
import { getUserId } from "../utils";

const myLogger = createLogger("deleteTodo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  myLogger.info("Processing event: ", { event: event });

  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;

  myLogger.info("deleteTodo todoId: ", todoId);
  myLogger.info("deleteTodo userId: ", userId);

  try {
    const deleteData = await deleteTodo(todoId, userId);
    myLogger.info("Deleted todoId and userId: ", { todoId, userId });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        item: deleteData,
      }),
    };
  } catch (err) {
    myLogger.error("Unable to delete ToDo. Error JSON:", {
      error: JSON.stringify(err, null, 2),
    });

    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "",
    };
  }
};
