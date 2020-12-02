import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";

export class AwsCdkPlaygroundStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Add a typed lambda that will add two numbers together
    //
    // Just by calling the constructor and passing "this" in, the lambda named
    //   "Add" will be added to the stack
    new lambda.Function(this, "Add", {
      // By defining an "AssetCode" object, we can tell the CDK service
      //   to package the code in a given folder.
      code: new lambda.AssetCode(path.join(__dirname, "/lambdas")),
      // This lambda will run in a Node 12 environment.
      runtime: lambda.Runtime.NODEJS_12_X,
      // Tell the lambda what function to execute. All the code in
      //   the folder defined above will be exposed to the lambda,
      //   so we have to tell it what file and what function in
      //   the file to run.
      handler: "add.add",
    });
  }
}
