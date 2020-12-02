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
export const getUser = async (userId: string) => {
  const table = getDynamoTable();
  const user = await table.get({ userId });
  return user;
};

/**
 * Attempt to post the given user to the DynamoDb.
 *    If a userId is included in the payload it will post that key.
 *    If not, one will be generated for them.
 *
 * @param payload - user data to post
 */
export const putUser = async ({
  userId,
  ...payload
}: Record<string, unknown>) => {
  const user = {
    // Generate a random bit of text for an ID if no UserId provided
    userId: userId || Math.random().toString(32).substr(2),
    ...payload,
  };
  const table = getDynamoTable();
  await table.put(user);
  // Return the posted payload.
  return user;
};
