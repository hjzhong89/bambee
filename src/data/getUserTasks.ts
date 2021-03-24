import {DynamoDB} from 'aws-sdk';
import {Context} from 'aws-lambda';
import {Task} from "./createTask";

export type GetUserTasksEvent = {
    userId: string;
}

const client = new DynamoDB.DocumentClient();

export const getUserTasks = async (event: GetUserTasksEvent, context: Context): Promise<Task[]> => {
    const params = {
        TableName: `bambee-${process.env.NODE_ENV}-tasks`,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': event.userId,
        },
    };

    const results = await client.query(params).promise()

    return results.Items as Task[];
}
