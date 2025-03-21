import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createRelease } from './functions/create-release/resource';
import { createReleaseProxy } from './functions/create-release-proxy/resource';
import * as iam from "aws-cdk-lib/aws-iam"
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as cdk from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  data,
  createRelease,
  createReleaseProxy,
});


const stepFunctionPolicyStmt = new iam.PolicyStatement({
  sid: "AllowStartStateMachine",
  actions: ["states:StartExecution"],
  resources: ["*"],
})

const proxyLambdaInstance = backend.createReleaseProxy.resources.lambda;
proxyLambdaInstance.addToRolePolicy(stepFunctionPolicyStmt)

 const task = new tasks.LambdaInvoke(
        backend.stack,
        'Invoke GraphQL Lambda',
        {
            lambdaFunction: proxyLambdaInstance,
            payload: stepfunctions.TaskInput.fromObject({
              releaseDate: stepfunctions.JsonPath.stringAt("$.releaseDate"),
              releaseTitle: stepfunctions.JsonPath.stringAt("$.releaseTitle"),
            }),
            outputPath: '$.Payload',
        });

    const passState = new stepfunctions.Pass(backend.stack, 'Pass State', {
      result: stepfunctions.Result.fromObject({ message: 'Step Function Completed' }),
    });

    // Define the Step Function workflow
    const definition = task.next(passState);

    // Create the Step Function
    const stepFunction = new stepfunctions.StateMachine(backend.stack, 'CreateRelease', {
      definition,
      timeout: cdk.Duration.minutes(5),
    });
/*
Final step in process. 
*/
backend.addOutput({
  custom: {
    stepFunctionArn: stepFunction.stateMachineArn,
  },

});

