import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import { updateTodo } from "../../businessLogic/todos";

const myLogger = createLogger("updateTodo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  myLogger.info("Processing event: ", { event: event });

  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
  const userId = getUserId(event);

  try {
    const updateTodoBody = await updateTodo(updatedTodo, todoId, userId);
    myLogger.info("ToDo updated", { updatedItem: updateTodoBody });

    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        uploadUrl: updateTodoBody,
      }),
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
