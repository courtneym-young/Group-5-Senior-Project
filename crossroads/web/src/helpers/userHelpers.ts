import { useEffect, useState } from "react";
import type { Schema } from "@/data-schema";
import { generateClient } from "aws-amplify/data";
import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
} from "aws-amplify/auth";
import { GroupType } from "../types/group-types";

const client = generateClient<Schema>();

export const useFetchUsersList = () => {
    const [users, setUsers] = useState<Array<Schema["User"]["type"]>>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await client.models.User.list();
                setUsers(result.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const refreshUsers = async () => {
        try {
            const result = await client.models.User.list();
            setUsers(result.data);
        } catch (error) {
            console.error("Error refreshing users:", error);
        }
    };

    return { users, refreshUsers };
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await client.models.User.get({ id: userId });
        setUser(result.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [userId]);

  return { user, loading, error };
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

    const result = await client.models.User.update({
      ...currentUser.data,
      ...userData,
      id: userId,
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
