import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {SQS} from 'aws-sdk'

const sqs = new SQS();

export const updateUserTask = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: 'Invalid task'
        }
    }

    const task = JSON.parse(event.body);
    console.log('Event received', JSON.stringify(task))
    const params = {
        QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.ACCOUNT_ID}/bambee-${process.env.NODE_ENV}-task-update-v2`,
        MessageBody: JSON.stringify(task),
    }
    const {MessageId} = await sqs.sendMessage(params).promise()
    return {
        statusCode: 200,
        body: MessageId || '',
    };
};
