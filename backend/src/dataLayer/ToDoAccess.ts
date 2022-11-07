import * as AWS from "aws-sdk";
const AWSXRay = require("aws-xray-sdk");
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Types } from "aws-sdk/clients/s3";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
import { createLogger } from "../utils/logger";

const XrayAWS = AWSXRay.captureAWS(AWS);
const myLogger = createLogger("todoAccess");

export class ToDoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XrayAWS.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new AWS.S3({ signatureVersion: "v4" }),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME
  ) {}

  async getAllToDo(userId: string): Promise<TodoItem[]> {
    const params = {
      TableName: this.todoTable,
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const result = await this.docClient.query(params).promise();
    myLogger.info("getAllToDo", { params: result });

    const items = result.Items;

    return items as TodoItem[];
  }

  async createToDo(todoItem: TodoItem): Promise<TodoItem> {
    const params = {
      TableName: this.todoTable,
      Item: todoItem,
    };

    const result = await this.docClient.put(params).promise();
    myLogger.info("createToDo", { params: result });

    return todoItem as TodoItem;
  }

  async updateToDo(
    todoUpdate: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    const updateExpression = "set #name = :a, #b = :dueDate, #c = :done";

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: {
        "#a": "name",
        "#b": "dueDate",
        "#c": "done",
      },
      ExpressionAttributeValues: {
        ":a": todoUpdate["name"],
        ":b": todoUpdate["dueDate"],
        ":c": todoUpdate["done"],
      },
      ReturnValues: "NEW_TODO",
    };

    const result = await this.docClient.update(params).promise();
    const attributes = result.Attributes;

    myLogger.info("updateToDo", { params: params });

    return attributes as TodoUpdate;
  }

  async deleteToDo(todoId: string, userId: string): Promise<string> {
    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
    };

    const result = await this.docClient.delete(params).promise();

    myLogger.info("deleteToDo", { params: result });

    return "" as string;
  }

  async generateUploadUrl(todoId: string): Promise<string> {
    const url = this.s3Client.getSignedUrl("putObject", {
      Bucket: this.s3BucketName,
      Key: todoId,
      Expires: 1000,
    });
    myLogger.info("generateUploadUrl", { params: url });

    return url as string;
  }
}
