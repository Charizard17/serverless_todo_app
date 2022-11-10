import { CreateTodoRequest } from "./CreateTodoRequest";
import { UpdateTodoRequest } from "./UpdateTodoRequest";

export interface GetTodosInterface {
  idToken: string;
}

export interface CreateTodoInterface {
  idToken: string;
  newTodo: CreateTodoRequest;
}

export interface UpdateTodoInterface {
  idToken: string;
  todoId: string;
  updatedTodo: UpdateTodoRequest;
}
export interface DeleteTodoInterface {
  idToken: string;
  todoId: string;
}

export interface GetUploadUrlInterface {
  idToken: string;
  todoId: string;
}

export interface UploadFileInterface {
  uploadUrl: string;
  file: Buffer;
}
