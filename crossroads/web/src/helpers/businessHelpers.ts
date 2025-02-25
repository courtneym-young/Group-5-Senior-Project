import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export const useFetchBusinessList = () => {
  const [businesses, setBusinesses] = useState<
    Array<Schema["Business"]["type"]>
  >([]);

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

export const useTotalBusinessCount = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const result = await client.models.Business.list();
        setTotal(result.data.length);
      } catch (error) {
        console.error("Error fetching total business count:", error);
      }
    };
    fetchTotalCount();
  }, []);

  return total;
};

export const useFlaggedBusinessCount = () => {
    const [flaggedCount, setFlaggedCount] = useState(0);

    useEffect(() => {
        const fetchFlaggedCount = async () => {
            try {
                const result = await client.models.Business.list({
                    filter: { status: { eq: "FLAGGED" } }
                });
                setFlaggedCount(result.data.length);
            } catch (error) {
                console.error("Error fetching flagged business count:", error);
            }
        };
        fetchFlaggedCount();
    }, []);

    return flaggedCount;
};

export const useVerifiedBusinessCount = () => {
    const [verifiedCount, setVerifiedCount] = useState(0);

    useEffect(() => {
        const fetchVerifiedCount = async () => {
            try {
                const result = await client.models.Business.list({
                    filter: { status: { eq: "VERIFIED" } }
                });
                setVerifiedCount(result.data.length);
            } catch (error) {
                console.error("Error fetching verified business count:", error);
            }
        };
        fetchVerifiedCount();
    }, []);

    return verifiedCount;
};