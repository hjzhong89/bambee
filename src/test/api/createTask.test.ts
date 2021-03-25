import {createTask} from '../../api/createTask';
import {APIGatewayEvent, Context} from 'aws-lambda';
import {SQS} from 'aws-sdk';

const {env} = process;
jest.mock('aws-sdk', () => {
    const mockSQS = {
        sendMessage: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({MessageId: '12345'})
    };
    return {
        SQS: jest.fn(() => mockSQS),
    };
});

const HOUR_IN_MILLIS = 60 * 60 * 1000;
const context = {} as Context;
const sqs = new SQS();

describe('api/createTask', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.REGION = 'us-east-1';
        process.env.ACCOUNT_ID = '12345';
        process.env.NODE_ENV = 'unit-test'
    });

    afterEach(() => {
       process.env = env;
    });

    it('returns a 200 and success for a valid event', async () => {
        const task = {
            'userId': 'jzhong',
            'name': 'Finish coding assignment',
            'description': 'Write unit tests',
            'dueDate': Date.now() + HOUR_IN_MILLIS,
        };
        const event = {
            body: JSON.stringify(task),
        };
        const expected = {
            statusCode: 200,
            body: '12345'
        };

        const response = await createTask(event as APIGatewayEvent, context);
        expect(response).toEqual(expected);
        expect(sqs.sendMessage).toHaveBeenCalledTimes(1)
        expect(sqs.sendMessage).toHaveBeenCalledWith({
            QueueUrl: 'https://sqs.us-east-1.amazonaws.com/12345/bambee-unit-test-task-createTask',
            MessageBody: JSON.stringify(task),
        });
    });

    it('returns 400 if body is empty and does not post task', async () => {
       const event = {};
       const expected = {
           statusCode: 400,
           body: 'Invalid task',
       };
       const response = await createTask(event as APIGatewayEvent, context);
       expect(response).toEqual(expected);
       expect(sqs.sendMessage).toHaveBeenCalledTimes(0);
    });
});
