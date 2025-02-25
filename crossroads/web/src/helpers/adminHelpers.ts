import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { GroupType } from "../types/group-types";

const client = generateClient<Schema>();

export const changeUserGroup = async (groupName: GroupType, userId: string) => {
  try {
    await client.mutations.addUserToGroup({
      groupName,
      id: userId,
    });
    console.log(`User ${userId} added to group ${groupName}`);
  } catch (error) {
    console.error(`Failed to add user ${userId} to group ${groupName}:`, error);
  }
};

