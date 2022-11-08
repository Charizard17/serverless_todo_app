import * as uuid from "uuid";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { parseUserId } from "../auth/utils";
import { TodoUpdate } from "../models/TodoUpdate";
import { createLogger } from "../utils/logger";
import { TodoAccess } from "../dataLayer/todoAccess";

const _todoAccess = new TodoAccess();
const myLogger = createLogger("Todos");

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const userId = parseUserId(jwtToken);

  const newItem = {
    ...createTodoRequest,
    userId,
    done: false,
    createdAt: new Date().toISOString(),
    todoId: uuid.v4(),
  };

  return await _todoAccess.createTodo(newItem);
}

export async function deleteTodo(todoId: string, userId: string): Promise<any> {
  return await _todoAccess.deleteTodo(todoId, userId);
}

export async function getTodos(userId: string): Promise<any> {
  return await _todoAccess.getTodos(userId);
}

export async function updateTodo(
  todoUpdate: TodoUpdate,
  todoId: string,
  userId: string
) {
  return await _todoAccess.updateTodo({
    todoId,
    userId,
    name: todoUpdate.name,
    dueDate: todoUpdate.dueDate,
    done: todoUpdate.done,
    createdAt: new Date().toISOString(),
  });
}

export function generateUploadUrl(todoId: string): Promise<string> {
  myLogger.info("generateUploadUrl todoId", { params: todoId });
  return _todoAccess.generateUploadUrl(todoId);
}
