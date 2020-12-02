import * as AWS from "aws-sdk";

/**
 * A service that can get and put data to a DynamoDB.
 */
export class DynamoDatabaseService {
  /**
   * Name of the managed table.
   */
  protected readonly tableName: string;
  /**
   * Client to interact with Dynamo.
   */
  protected readonly dynamoClient: AWS.DynamoDB;

  /**
   * Create a new DynamoDB service.
   *
   * @param tableName - Name of table to interact with
   */
  constructor(tableName: string) {
    this.tableName = tableName;
    // Create a Dynamo Client with the given API version
    this.dynamoClient = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  }

  /**
   * Get an object with the matching key
   *
   * @param key
   */
  public async get(key: object) {
    console.log("Attempting to query for ", key);

    // Build the input payload
    const input: AWS.DynamoDB.GetItemInput = {
      // Convert the raw Javascript key to Dynamo's format
      Key: AWS.DynamoDB.Converter.marshall(key),
      TableName: this.tableName,
    };
    console.log("Running Dynamo getItem with input", input);

    // Attempt to fetch the item
    const fetched = await this.dynamoClient.getItem(input).promise();

    console.log("Found", fetched.Item);
    if (!fetched.Item) {
      // Return null if not found
      return null;
    }

    // Convert the Dynamo object to Javascript
    const unmarshalled = AWS.DynamoDB.Converter.unmarshall(fetched.Item);
    console.log("Unmarshalled to", unmarshalled);

    // Return the result
    return unmarshalled;
  }

  public async put(object: object) {
    console.log("Attempting to put ", object);

    // Build the input payload
    const input: AWS.DynamoDB.PutItemInput = {
      // Convert the raw Javascript object to Dynamo's format
      Item: AWS.DynamoDB.Converter.marshall(object),
      TableName: this.tableName,
    };

    console.log("Running Dynamo putItem with input", input);
    // Attempt to put the item in the database
    await this.dynamoClient.putItem(input).promise();
    
    console.log("Succesfully put item.");
  }
}
