import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as path from "path";

const distFolder = path.join(__dirname, "../dist");

export class AwsCdkPlaygroundStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      // By defining an "AssetCode" object, we can tell the CDK service
      //   to package the code in a given folder.
    const code = new lambda.AssetCode(distFolder);
    // These lambdas will run in a Node 12 environment.
    const runtime = lambda.Runtime.NODEJS_12_X;

    // Add a typed lambda that will add two numbers together
    new lambda.Function(this, "Add", {
      code: new lambda.AssetCode(distFolder),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "add.add",
    });

    // Build a Dynamo Table that will hold user data.
    const userTable = new dynamodb.Table(this, "UserTable", {
      // Table only has one key: "userId".
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
    });

    // Lambda for fetching users.
    const getUserLambda = new lambda.Function(this, "GetUser", {
      code,
      runtime,
      handler: "user-actions.getUser",
      // Pass in the name of the table as an env variable.
      environment: { USER_TABLE: userTable.tableName },
    });
    // Grant the lambda read permissions on the user table.
    userTable.grantReadData(getUserLambda);

    // Lambda for posting users
    const putUserLambda = new lambda.Function(this, "PutUser", {
      code,
      runtime,
      handler: "user-actions.putUser",
      // Pass in the name of the table as an env variable.
      environment: { USER_TABLE: userTable.tableName },
    });
    // Grant the lambda write permissions on the user table.
    userTable.grantWriteData(putUserLambda);

    // API Gateway
    const apiGateway = new apigateway.RestApi(this, "UserApi", {}); // This will automatically be exported from the stack.
    // Create an API Gateway integration for the getUserLambda
    const getLambdaIntegration = new apigateway.LambdaIntegration(
      getUserLambda
    );
    // Create an API Gateway integration for the putUserLambda
    const putLambdaIntegration = new apigateway.LambdaIntegration(
      putUserLambda
    );

    // Add a "user" path to the API gateway
    const userPath = apiGateway.root.addResource("user");
    // Assign the putUserLambda integration to the "user" path PUT method
    userPath.addMethod("PUT", putLambdaIntegration);

    // Add a "user/{userId}" path to the API gateway by adding a sub-resource to
    //   the root "user" path.
    const userPathParameterized = userPath.addResource("{userId}");
    // Assign the getUserLambda integration to the "user/{userId}" path GET method
    userPathParameterized.addMethod("GET", getLambdaIntegration);
    // Assign the putUserLambda integration to the "user/{userId}" path PUT method
    userPathParameterized.addMethod("PUT", putLambdaIntegration);
  }
}
