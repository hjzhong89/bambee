import {DynamoDB} from 'aws-sdk';
import {Context} from 'aws-lambda';
import {Task} from "./createTask";

export type GetTaskById = {
    userId: string;
    taskId: string;
}

const client = new DynamoDB.DocumentClient();

export const getTaskById = async (event: GetTaskById, context: Context): Promise<Task> => {
    const params = {
        TableName: `bambee-${process.env.NODE_ENV}-tasks`,
        Key: {...event}
    };

    const results = await client.get(params).promise()

    return results.Item as Task;
}
