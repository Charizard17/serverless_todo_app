import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { createLogger } from "../../utils/logger";
import { updateTodo } from "../../businessLogic/todos";
import { getUserId } from "../utils";

const myLogger = createLogger("updateTodo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  myLogger.info("Processing event: ", { event: event });

  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
  myLogger.info("updatedTodo UpdateTodoRequest", updatedTodo);

  try {
    await updateTodo(updatedTodo, todoId, userId);
    myLogger.info("updateTodo updatedItem", { updatedItem: updateTodo });

    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "",
    };
  } catch (e) {
    myLogger.error("error:", { error: e.message });

    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: `error ${e}`,
    };
  }
};
