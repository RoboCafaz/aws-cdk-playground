import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

export class AwsCdkPlaygroundStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Build a simple lambda that just returns hello world.
    //
    // Just by calling the constructor and passing "this" in, the lambda named
    //   "HelloWorld" will be added to the stack
    new lambda.Function(this, "HelloWorld", {
      // The code will be directly deployed from this string. Remember to export
      //   your function and have it return a Promise!
      code: new lambda.InlineCode(
        "exports.handler = async () => 'Hello World!';"
      ),
      // This lambda will run in a Node 12 environment.
      runtime: lambda.Runtime.NODEJS_12_X,
      // Tell the lambda what function to execute. By default, the inline code
      //   will be written to an index.js file. We deliberately exported our
      //   function named "handler"
      handler: "index.handler",
    });
  }
}
