// Check the permission of the user 
import { GroupType } from "../types/group-types";


export const isUserInGroup = (userGroups: string[], requiredGroup: GroupType): boolean => {
  return userGroups.includes(requiredGroup);
};