import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import moment from 'moment';

const authenticateUser = (username: string, password: string): void => {
    if (!username || !password) {
        throw new Error('Invalid Username or Password');
    }
}

const genToken = (username: string): string => {
    const payload = {
        issuer: username,
        exp: moment().add(1, 'hour').unix(),
    };

    return JSON.stringify(payload) //Not an actual JWT
}

const authorize = (username: string, password: string): string => {
    authenticateUser(username, password);
    return genToken(username);
}

/**
 * Generate and return a JWT from JwtProvider
 * @param event
 * @param context
 */
export const provideJwt = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    if (event.body) {
        const {username, password} = JSON.parse(event.body);
        const token = authorize(username, password);
        return {
            statusCode: 200,
            body: token
        }
    } else {
        return {
            statusCode: 401,
            body: 'Invalid credentials',
        }
    }
};
