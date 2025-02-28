import type { Schema } from "../resource";
import { env } from "$amplify/env/remove-user-to-group";
import {
  AdminRemoveUserFromGroupCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

type Handler = Schema["removeUserFromGroup"]["functionHandler"];
const client = new CognitoIdentityProviderClient();

export const handler: Handler = async (event) => {
  const { id, groupName } = event.arguments;
  const command = new AdminRemoveUserFromGroupCommand({
    Username: id,
    GroupName: groupName,
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
  });
  const response = await client.send(command);
  return response;
};
