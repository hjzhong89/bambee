import {getUserTasks} from '../../api/getUserTasks';
import {Lambda} from 'aws-sdk';
import {APIGatewayEvent, Context} from "aws-lambda";

jest.mock('aws-sdk', () => {
    const mockLambda = {
        invoke: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({
            StatusCode: 200,
            Payload: [{hello: 'world'}],
        })
    }
    return {
        Lambda: jest.fn(() => mockLambda),
    };
});
const context = {} as Context;
const client = new Lambda();

describe('getUserTasks', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns all tasks for the given user', async () => {
        const event = {
            pathParameters: {
                userId: 'jzhong'
            },
            body: ''
        };
        const expected = {
            statusCode: 200,
            body: JSON.stringify([{hello: 'world'}])
        }

        const response = await getUserTasks(event as unknown as APIGatewayEvent, context);

        expect(response).toEqual(expected);
        expect(client.invoke).toHaveBeenCalledTimes(1);
        expect(client.invoke).toHaveBeenCalledWith({
            FunctionName: 'bambee-task-get-for-user',
            Payload: JSON.stringify(event.pathParameters)
        })
    });

    it('returns 400 if pathParameters is missing', async () => {
        const event = {
            body: ''
        };
        const expected = {
            statusCode: 400,
            body: 'Invalid task'
        }

        const response = await getUserTasks(event as unknown as APIGatewayEvent, context);

        expect(response).toEqual(expected);
        expect(client.invoke).toHaveBeenCalledTimes(0);
    });

    it('returns 400 is userId is missing', async () => {
        const event = {
            pathParameters: {
                foo: 'bar'
            },
            body: ''
        };
        const expected = {
            statusCode: 400,
            body: 'Invalid task'
        }

        const response = await getUserTasks(event as unknown as APIGatewayEvent, context);

        expect(response).toEqual(expected);
        expect(client.invoke).toHaveBeenCalledTimes(0);
    });
});
