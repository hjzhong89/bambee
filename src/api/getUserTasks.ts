import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {Lambda} from 'aws-sdk';
import {GetUserTasksEvent} from '../data/getUserTasks';

const client = new Lambda();

export const getUserTasks = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log('Get users', JSON.stringify(event))

    if (!event.pathParameters || !event.pathParameters.userId) {
        return {
            statusCode: 400,
            body: 'Invalid task'
        }
    }

    const {userId} = event.pathParameters
    const taskEvent: GetUserTasksEvent = {userId};
    const params = {
        FunctionName: 'bambee-task-get-for-user',
        Payload: JSON.stringify(taskEvent),
    };
    const { StatusCode, Payload} = await client.invoke(params).promise()

    return {
        statusCode: 200,
        body: JSON.stringify(Payload),
    }
}
