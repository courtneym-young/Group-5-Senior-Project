import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
} from "aws-amplify/auth";
import { GroupType } from "../types/group-types";

const client = generateClient<Schema>();

export const useFetchUsersList = (excludeCurrentUser = true) => {
  const [users, setUsers] = useState<Array<Schema["User"]["type"]>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
      const fetchUsers = async () => {
          try {
              setLoading(true);
              // First get current user attributes if we need to exclude current user
              let currentUserSub: string | undefined;
              
              if (excludeCurrentUser) {
                  try {
                      const attributes = await fetchUserAttributes();
                      currentUserSub = attributes.sub;
                  } catch (err) {
                      console.error("Error fetching current user attributes:", err);
                  }
              }
              
              const result = await client.models.User.list();
              console.log(result)
              
              // Filter out current user if requested
              if (excludeCurrentUser && currentUserSub) {
                  setUsers(result.data.filter(user => {
                      // Extract sub from profileOwner (format: sub)
                      const userSub = user.profileOwner;
                      return userSub !== currentUserSub;
                  }));
              } else {
                  setUsers(result.data);
              }
              setError(null);
          } catch (error) {
              console.error("Error fetching users:", error);
              setError("Failed to fetch users");
          } finally {
              setLoading(false);
          }
      };
      
      fetchUsers();
  }, [excludeCurrentUser]);

  const refreshUsers = async () => {
      try {
          const result = await client.models.User.list();
          
          // Filter out current user if requested
          if (excludeCurrentUser) {
              const attributes = await fetchUserAttributes();
              const currentUserSub = attributes.sub;
              
              setUsers(result.data.filter(user => {
                  const userSub = user.profileOwner.split('::')[1];
                  return userSub !== currentUserSub;
              }));
          } else {
              setUsers(result.data);
          }
      } catch (error) {
          console.error("Error refreshing users:", error);
      }
  };

  return { users, refreshUsers, loading, error };
};

export const useFetchUserAttributes = () => {
  const [userAttributes, setUserAttributes] = useState<Record<
    string,
    string
  > | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserAttributes = async () => {
      try {
        const attributes: FetchUserAttributesOutput =
          await fetchUserAttributes();
        setUserAttributes(attributes as Record<string, string>);
      } catch (err) {
        console.error("Error fetching user attributes:", err);
        setError("Failed to fetch user attributes");
      } finally {
        setLoading(false);
      }
    };

    getUserAttributes();
  }, []);

  return { userAttributes, loading, error };
};

export const useFetchUserById = (userId: string) => {
  const [user, setUser] = useState<Schema["User"]["type"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const result = await client.models.User.get({ id: userId });
      setUser(result.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [userId]);

  return { user, loading, error, refetch: fetchUser };
};

export const updateUser = async (
  userId: string,
  userData: Partial<Schema["User"]["type"]>
) => {
  try {
    const currentUser = await client.models.User.get({ id: userId });
    
    if (!currentUser.data) {
      throw new Error("User not found");
    }
    
    // Only update the fields that are in userData
    const result = await client.models.User.update({
      id: userId,
      ...userData,
    });
    
    return result.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateUserGroup = async (userId: string, profileOwner: string, new_group: GroupType) => {
  try {
    await client.mutations.addUserToGroup({
      groupName: new_group,
      id: profileOwner,
    });

    return await updateUser(userId, { groupName: new_group });
  } catch (error) {
    console.error("Error updating user group:", error);
    throw error;
  }
};

export const changeUserGroup = async (groupName: GroupType, userId: string, profileOwner: string) => {
    console.log("Change User Group Called", groupName, userId, profileOwner)
  try {
    await updateUserGroup(userId, profileOwner, groupName);
  } catch (error) {
    console.error("Error changing user group:", error);
    throw error;
  }
};
