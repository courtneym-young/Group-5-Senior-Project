import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

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
