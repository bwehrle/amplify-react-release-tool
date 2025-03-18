## Amplify-based Release Tool POC


## Overview

This repository provides a release tool UX with limited functionality.
* Create release
* View releases in calendar form (month, week, etc)

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: All calls are handled by GraphQL operations.
- **Database**: Real-time database powered by Amazon DynamoDB.
- **Interactive UX**: User interfaces asynchronously updates based on changes from user via GraphQL subscriptions

## Deploying to AWS

* Ensure that you have a profile that can deploy for an AWS account.  
* Then add this repository to AWS Amplify following the onboarding instructions: https://docs.amplify.aws/react/start/quickstart/#2-deploy-the-starter-app
* Clone the repository
* Install NPM dependencies:  `npm -i`
* In a new terminal window, start an AWS sandbox: `npx ampx sandbox --profile <myProfile>`
* Run the application locally once the sandbox is up and running `npm run dev`

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.