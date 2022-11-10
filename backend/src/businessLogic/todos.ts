import * as uuid from "uuid";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { parseUserId } from "../auth/utils";
import { TodoUpdate } from "../models/TodoUpdate";
import { TodoAccess } from "../dataLayer/todoAccess";
import { BucketAccess } from "../dataLayer/bucketAccess";

const _todoAccess = new TodoAccess();
const _bucketAccess = new BucketAccess();

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const parsedUserId = parseUserId(userId);

  const newItem = {
    ...createTodoRequest,
    userId: parsedUserId,
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

export async function attachUrl(userId: string, todoId: string) {
  const url = _bucketAccess.getImageUrl(todoId);
  await _todoAccess.updateUrl(userId, url, todoId);
}

export async function getPresignedUrl(imageId: uuid) {
  console.log("getPresignedUrl imageId:", imageId);
  const presignedUrl = _bucketAccess.getPutSignedUrl(imageId);
  console.log("getPresignedUrl presignedUrl:", presignedUrl);
  return presignedUrl;
}
