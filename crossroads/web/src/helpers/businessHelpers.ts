import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export const useFetchBusinessList = () => {
    const [businesses, setBusinesses] = useState<Array<Schema["Business"]["type"]>>([]);
    
    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const result = await client.models.Business.list();
                setBusinesses(result.data);
            } catch (error) {
                console.error("Error fetching businesses:", error);
            }
        };
        fetchBusinesses();
    }, []);

    return businesses;
};
