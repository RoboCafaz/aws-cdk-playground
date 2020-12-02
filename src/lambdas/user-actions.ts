import { HttpRequest, HttpResponse } from "../modules/http-models";
import { DynamoDatabaseService } from "../modules/database-service";

let dynamoServiceSingleton: DynamoDatabaseService | null = null;
const getDynamoTable = () => {
  if (!dynamoServiceSingleton) {
    dynamoServiceSingleton = new DynamoDatabaseService(process.env.USER_TABLE!);
  }
  return dynamoServiceSingleton;
};
/**
 * Attempt to fetch a user with the given id from the DynamoDB
 *
 * @param userId - id of user to fetch
 */
export const getUser = async ({
  pathParameters: { userId } = {}
}: HttpRequest): Promise<HttpResponse> => {
  const table = getDynamoTable();
  const user = await table.get({ userId });
  return { statusCode: 200, body: JSON.stringify(user) };
};

/**
 * Attempt to post the given user to the DynamoDb.
 *    If a userId is included in the payload it will post that key.
 *    If not, one will be generated for them.
 *
 * @param userId - userID to post. Can be provided in the path params or the body.
 * @param payload - user data to post
 */
export const putUser = async ({
  pathParameters,
  body,
}: HttpRequest): Promise<HttpResponse> => {
  console.log(`Received path params: "${pathParameters}", body: "${body}"`);
  if (!body) {
    return { statusCode: 502, body: "Body was empty." };
  }
  const parsedBody = JSON.parse(body);
  const user = {
    // Generate a random bit of text for an ID if no UserId provided
    //   Check the path params first, then the payload.
    userId: pathParameters?.userId || parsedBody?.userId || Math.random().toString(32).substr(2),
    ...parsedBody,
  };
  const table = getDynamoTable();
  await table.put(user);
  return { statusCode: 200, body: JSON.stringify(user) };
};
