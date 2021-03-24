import {DynamoDB} from 'aws-sdk';
import {Context} from "aws-lambda";
import * as uuid from 'uuid';

export type CreateTaskEventV1 = {
    userId: string,
    name: string;
    description: string;
    dueDate: number;
}

export type Task = {
    userId: string;
    taskId: string;
    name: string;
    description: string;
    dueDate: number;
    status: string;
}

const client = new DynamoDB.DocumentClient();

/**
 * Persists the Task to DynamoDB
 * @param event
 * @param context
 */
export const create = async (event: CreateTaskEventV1, context: Context): Promise<Task> => {
    const task: Task = {
        ...event,
        status: 'New',
        taskId: uuid.v4()
    }

    const params = {
        TableName: `bambee-${process.env.NODE_ENV}-tasks`,
        Item: {
            ...task
        }
    }

    await client.put(params).promise();
    return task;
}
