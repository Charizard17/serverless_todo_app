import * as AWS from "aws-sdk";
const AWSXRay = require("aws-xray-sdk-core");
import { TodoItem } from "../models/TodoItem";
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);
const myLogger = createLogger("TodoAccess");
const dynamoDbClient = createDynamoDbClient();
const todosTableName = process.env.TODOS_TABLE;
const userIdIndex = process.env.USER_ID_INDEX;
const s3BucketName = process.env.S3_BUCKET_NAME;

enum ValueSet {
  ALL_NEW,
  UPDATED_OLD,
  ALL_OLD,
  NONE,
  UPDATED_NEW,
}

export class TodoAccess {
  constructor() {}

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await dynamoDbClient
      .put(
        {
          TableName: todosTableName,
          Item: todoItem,
        },
        function (err, data) {
          if (err)
            myLogger.error("Error occured when putting an item to Database", {
              error: err,
              item: todoItem,
            });
          else
            myLogger.info("Data successfully added to Database!", {
              item: data,
            });
        }
      )
      .promise();
    return todoItem;
  }

  async deleteTodo(todoId: string, userId: string): Promise<any> {
    await dynamoDbClient
      .delete(
        {
          TableName: todosTableName,
          Key: {
            userId: userId,
            todoId: todoId,
          },
        },
        function (err, _) {
          if (err)
            myLogger.error(
              "Error occured on deleting an item from the Database",
              {
                error: err,
                item: { userId, todoId },
              }
            );
          else
            myLogger.info(
              "Data has been successfully deleted from the Database",
              {
                item: {
                  userId: userId,
                  todoId: todoId,
                },
              }
            );
        }
      )
      .promise();
  }

  async getTodos(userId: string): Promise<any> {
    return await dynamoDbClient
      .query(
        {
          TableName: todosTableName,
          IndexName: userIdIndex,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId,
          },
          ScanIndexForward: false,
        },
        function (err, _) {
          if (err)
            myLogger.error("Error occured on getting a TodoItem", {
              error: err,
              todoId: userId,
            });
          else
            myLogger.info("Data has been fetched from database", {
              item: {
                userId: userId,
              },
            });
        }
      )
      .promise();
  }

  private async update(params: any): Promise<any> {
    await dynamoDbClient
      .update(params, function (err, data) {
        if (err) {
          myLogger.error("Unable to update item.", {
            error: JSON.stringify(err, null, 2),
          });
        } else {
          myLogger.info("UpdateItem succeeded:", {
            data: JSON.stringify(data, null, 2),
          });
        }
      })
      .promise();
  }

  async updateTodo(todoItem: TodoItem): Promise<any> {
    const updateExpression =
      "set #name = :name, #dueDate=:dueDate, #done=:done";
    const expressionAttributeValues = {
      ":name": todoItem.name,
      ":dueDate": todoItem.dueDate,
      ":done": todoItem.done,
    };
    const expressionAttributeNames = {
      "#name": "name",
      "#dueDate": "dueDate",
      "#done": "done",
    };
    const params = {
      TableName: todosTableName,
      Key: {
        todoId: todoItem.todoId,
        userId: todoItem.userId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: ValueSet[ValueSet.UPDATED_NEW],
    };
    myLogger.info("updateTodo params", params);
    await this.update(params);
    myLogger.info("updateTodo params updated");
    return todoItem;
  }

  async updateUrl(userId: string, url: string, todoId: string): Promise<any> {
    const updateExpression = "set #attachmentUrl = :attachmentUrl";

    const params = {
      TableName: todosTableName,
      Key: {
        todoId: todoId,
        userId: userId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: {
        ":attachmentUrl": url,
      },
      ExpressionAttributeNames: {
        "#attachmentUrl": "attachmentUrl",
      },
      ReturnValues: ValueSet[ValueSet.UPDATED_NEW],
    };

    myLogger.info("updateUrl params", params);

    await this.update(params);
  }

  getImageUrl(todoId) {
    const url = `https://${s3BucketName}.s3.amazonaws.com/${todoId}`;
    myLogger.info("getImageUrl", { imageUrl: url });
    return url;
  }
}

function createDynamoDbClient() {
  myLogger.info("Creating DynamoDB Client for Todos...");
  return new XAWS.DynamoDB.DocumentClient();
}
