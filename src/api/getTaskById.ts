import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {Lambda} from 'aws-sdk';
import {GetTaskById} from "../data/getTaskById";

const client = new Lambda();

export const getTaskById = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: 'Invalid task'
        }
    }

    const body = JSON.parse(event.body);
    const taskEvent: GetTaskById = {
        userId: body.userId,
        taskId: body.taskId,
    };
    const params = {
        FunctionName: 'bambee-task-by-id',
        Payload: JSON.stringify(taskEvent),
    };
    const { Payload} = await client.invoke(params).promise()

    return {
        statusCode: 200,
        body: JSON.stringify(Payload),
    }
}
