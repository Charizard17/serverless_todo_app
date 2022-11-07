import { TodoItem } from "../models/TodoItem";
import { parseUserId } from "../auth/utils";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoUpdate } from "../models/TodoUpdate";
import { ToDoAccess } from "../dataLayer/ToDoAccess";
import { createLogger } from "../utils/logger";

const myLogger = createLogger("todoAccess");

const uuidv4 = require("uuid/v4");
const toDoAccess = new ToDoAccess();

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken);
  myLogger.info("getAllToDo jwtToken", { params: jwtToken });
  return toDoAccess.getAllToDo(userId);
}

export function createToDo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const userId = parseUserId(jwtToken);
  const todoId = uuidv4();
  const s3BucketName = process.env.S3_BUCKET_NAME;
  const attachmentUrl = `https://${s3BucketName}.s3.amazonaws.com/${todoId}`;

  myLogger.info("createTodo attachmentUrl", { params: attachmentUrl });

  return toDoAccess.createToDo({
    userId: userId,
    todoId: todoId,
    attachmentUrl: attachmentUrl,
    createdAt: new Date().getTime().toString(),
    done: false,
    ...createTodoRequest,
  });
}

export function updateToDo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  jwtToken: string
): Promise<TodoUpdate> {
  const userId = parseUserId(jwtToken);
  myLogger.info("updateToDo userId", { params: userId });
  return toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken);
  myLogger.info("deleteToDo userId", { params: userId });
  return toDoAccess.deleteToDo(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
  myLogger.info("generateUploadUrl todoId", { params: todoId });
  return toDoAccess.generateUploadUrl(todoId);
}
