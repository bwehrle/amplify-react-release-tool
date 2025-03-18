import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createRelease } from './functions/create-release/resource';

defineBackend({
  auth,
  data,
  createRelease,
});
