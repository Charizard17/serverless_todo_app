import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { createLogger } from "../../utils/logger";
import { createTodo } from "../../businessLogic/todos";

const myLogger = createLogger("creteToDo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  myLogger.info("Processing event: ", { event: event });

  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const authorization = event.headers.Authorization;
  const split = authorization.split(" ");
  const userId = split[1];

  myLogger.info("creteToDo newTodo", newTodo);
  myLogger.info("creteToDo userId", userId);

  try {
    const newItem = await createTodo(newTodo, userId);
    myLogger.info("New ToDo item created: ", { item: newItem });

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        item: newItem,
      }),
    };
  } catch (e) {
    myLogger.info("An error is occured when creating ToDo: ", {
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
