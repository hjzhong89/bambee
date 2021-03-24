import {DynamoDB} from 'aws-sdk';
import {Context} from "aws-lambda";
import {Task} from "./createTask";

const client = new DynamoDB.DocumentClient();

export enum TaskStatusV2 {
    'New',
    'Completed',
    'In-Progress'
}

export type UpdateTaskEventV2 = {
    userId: string,
    taskId: string;
    name: string;
    description: string;
    dueDate: number;
    status: TaskStatusV2;
}

/**
 * Persists the Task to DynamoDB
 * @param event
 * @param context
 */
export const updateTaskV2 = async (event: UpdateTaskEventV2, context: Context): Promise<Task> => {
    const params = {
        TableName: `bambee-${process.env.NODE_ENV}-tasks`,
        Item: {
            ...event
        }
    }

    await client.put(params).promise();
    return {
        ...event,
        status: event.status.toString(),
    };
}
