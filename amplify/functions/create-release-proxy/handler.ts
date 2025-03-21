
import { Schema } from '../../data/resource';
import { generateClient } from 'aws-amplify/api';
import outputs from "../../../amplify_outputs.json";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

Amplify.configure(outputs);
const client = generateClient<Schema>();
    
export const handler: Schema["CreateReleaseProxy"]["functionHandler"] = async (event) => {
  const {releaseDate,
          releaseTitle,
         } = event.arguments;
          
    // invoke step function using AWS step function SDK and "outputs" from amplify_outputs.json
    const sfClient = new SFNClient();
    const response = await sfClient.send( new StartExecutionCommand( {
      stateMachineArn: outputs.custom.stepFunctionArn,
      input: JSON.stringify({
        releaseDate,
        releaseTitle,
       })}));
    if (response.executionArn) {
      console.log(`Execution started with arn: ${response.executionArn}`);
    }
    return '';
};