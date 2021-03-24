import {DynamoDB} from 'aws-sdk';
import {Context} from "aws-lambda";
import {Task} from "./createTask";

export enum TaskStatusV1 {
    'New',
    'Completed',
}

export type UpdateTaskEventV1 = {
    userId: string,
    taskId: string;
    name: string;
    description: string;
    dueDate: number;
    status: TaskStatusV1;
}

const client = new DynamoDB.DocumentClient();

/**
 * Updates a task in DynamoDB the Task to DynamoDB
 * @param event
 * @param context
 */
export const updateTaskV1 = async (event: UpdateTaskEventV1, context: Context): Promise<Task> => {
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
