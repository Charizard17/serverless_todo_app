import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { getAllToDo } from "../../businessLogic/ToDo";
import { createLogger } from "../../utils/logger";

const myLogger = createLogger("todoAccess");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization;
  const split = authorization.split(" ");
  const jwtToken = split[1];

  const toDos = await getAllToDo(jwtToken);

  myLogger.info("getTodosHandler", { params: toDos });

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      items: toDos,
    }),
  };
};
