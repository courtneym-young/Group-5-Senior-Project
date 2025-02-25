import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { fetchUserAttributes, FetchUserAttributesOutput } from "aws-amplify/auth";


const client = generateClient<Schema>();

export const useFetchUsersList = () => {
    const [user, setUser] = useState<Array<Schema["User"]["type"]>>([]);
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await client.models.User.list();
                setUser(result.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    return user;
};
export const useFetchUserAttributes = () => {
    const [userAttributes, setUserAttributes] = useState<Record<string, string> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const getUserAttributes = async () => {
        try {
          const attributes: FetchUserAttributesOutput = await fetchUserAttributes();
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