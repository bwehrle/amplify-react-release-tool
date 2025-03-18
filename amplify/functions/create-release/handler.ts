
import { Schema } from '../../data/resource';
import { generateClient } from 'aws-amplify/api';
import outputs from "../../../amplify_outputs.json";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';

Amplify.configure(outputs);
const client = generateClient<Schema>();
    
export const handler: Schema["CreateRelease"]["functionHandler"] = async (event) => {
  const {releaseDate,
          releaseTitle,
          releaseBranch,
          preStagingEnv,
          currentState,
          releaseManager,
          qaPrime} = event.arguments;
          
    const newRelease = await client.models.Release.create({
      releaseDate,
      releaseTitle,
      releaseBranch,
      preStagingEnv,
      currentState,
      releaseManager,
      qaPrime
    });

    return newRelease.data?.releaseId!;
};