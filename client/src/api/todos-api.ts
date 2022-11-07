import { apiEndpoint } from "../config";
import { Todo } from "../interfaces/Todo";
import Axios from "axios";
import {
  CreateTodoInterface,
  DeleteTodoInterface,
  GetTodosInterface,
  GetUploadUrlInterface,
  PatchTodoInterface,
  UploadFileInterface,
} from "../interfaces/todosApiInterfaces";

export async function getTodos(props: GetTodosInterface): Promise<Todo[]> {
  console.log("Fetching todos");

  const response = await Axios.get(`${apiEndpoint}/todos`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${props.idToken}`,
    },
  });
  console.log("Todos:", response.data);
  return response.data.items;
}

export async function createTodo(props: CreateTodoInterface): Promise<Todo> {
  const data = JSON.stringify(props.newTodo);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${props.idToken}`,
  };
  const response = await Axios.post(`${apiEndpoint}/todos`, data, { headers });
  return response.data.item;
}

export async function patchTodo(props: PatchTodoInterface): Promise<void> {
  const data = JSON.stringify(props.updatedTodo);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${props.idToken}`,
  };
  await Axios.patch(`${apiEndpoint}/todos/${props.todoId}`, data, { headers });
}

export async function deleteTodo(props: DeleteTodoInterface): Promise<void> {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${props.idToken}`,
  };
  await Axios.delete(`${apiEndpoint}/todos/${props.todoId}`, { headers });
}

export async function getUploadUrl(
  props: GetUploadUrlInterface
): Promise<string> {
  try {
    const data = "";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${props.idToken}`,
    };
    const response = await Axios.post(
      `${apiEndpoint}/todos/${props.todoId}/attachment`,
      data,
      { headers }
    );
    return response.data.uploadUrl;
  } catch (err) {
    console.error("get upload url", err);
  }
  return "";
}

export async function uploadFile(props: UploadFileInterface): Promise<void> {
  try {
    await Axios.put(props.uploadUrl, props.file);
  } catch (err) {
    console.error(" Upload file", err);
  }
}
