import type { PostConfirmationTriggerHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/post-confirmation";
import { type Schema } from "../../data/resource";

const cognitoClient = new CognitoIdentityProviderClient();

// Configure Amplify Data
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);
Amplify.configure(resourceConfig, libraryOptions);

const dataClient = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  try {
    // Add user to the Cognito group
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      GroupName: env.GROUP_NAME,
      Username: event.userName,
      UserPoolId: event.userPoolId,
    });
    await cognitoClient.send(addToGroupCommand);
    console.log(`User ${event.userName} added to group ${env.GROUP_NAME}`);

    // Create a user profile in Amplify Data
    console.log(event)
    await dataClient.models.User.create({
      profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
      username: event.request.userAttributes.preferredUsername || "Unknown",
      groupName: env.GROUP_NAME,
      firstName: event.request.userAttributes.given_name || "Unknown",
      lastName: event.request.userAttributes.family_name || "Unknown",
      birthdate: event.request.userAttributes.birthdate || "Unknown",
    });
    console.log(`User created for ${event.userName}`);
  } catch (error) {
    console.error("Error in post-confirmation trigger:", error);
    throw error;
  }

  return event;
};
