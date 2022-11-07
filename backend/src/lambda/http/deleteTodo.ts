import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { deleteToDo } from "../../businessLogic/ToDo";
import { createLogger } from "../../utils/logger";

const myLogger = createLogger("todoAccess");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization;
  const split = authorization.split(" ");
  const jwtToken = split[1];

  const todoId = event.pathParameters.todoId;

  const deleteData = await deleteToDo(todoId, jwtToken);

  myLogger.info("deleteTodoHandler", { params: deleteData });

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: deleteData,
  };
};
