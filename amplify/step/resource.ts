import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as stepFunction from 'aws-cdk-lib/aws-stepfunctions';


interface StepFunctionStackProps extends cdk.StackProps {
    createReleaseLambda: lambda.IFunction;
}

export class StepFunctionStack extends cdk.Stack {
  public readonly stepFunction : stepFunction.IStateMachine;

  constructor(scope: Construct, id: string, props: StepFunctionStackProps) {
    super(scope, id, props);

    // Define a Step Function task to invoke the GraphQL Lambda function
    const task = new tasks.LambdaInvoke(
        this,
        'Invoke GraphQL Lambda',
        {
            lambdaFunction: props.createReleaseLambda,
            payload: stepfunctions.TaskInput.fromObject({
              releaseDate: stepfunctions.JsonPath.stringAt("$.releaseDate"),
              releaseTitle: stepfunctions.JsonPath.stringAt("$.releaseTitle"),
            }),
            outputPath: '$.Payload',
        });

    const passState = new stepfunctions.Pass(this, 'Pass State', {
      result: stepfunctions.Result.fromObject({ message: 'Step Function Completed' }),
    });

    // Define the Step Function workflow
    const definition = task.next(passState);

    // Create the Step Function
    this.stepFunction = new stepfunctions.StateMachine(this, 'CreateRelease', {
      definition,
      timeout: cdk.Duration.minutes(5),
    });
  }
}
