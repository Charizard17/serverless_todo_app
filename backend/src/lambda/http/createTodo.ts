import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { createToDo } from "../../businessLogic/ToDo";
import { createLogger } from "../../utils/logger";

const myLogger = createLogger("todoAccess");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization;
  const split = authorization.split(" ");
  const jwtToken = split[1];

  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const toDoItem = await createToDo(newTodo, jwtToken);

  myLogger.info("createTodoHandler", { params: toDoItem });

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      item: toDoItem,
    }),
  };
};
