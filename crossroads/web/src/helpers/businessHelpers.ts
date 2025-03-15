import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { ResolvedBusiness, ResolvedBusinessEx } from "../types/business-types";

const client = generateClient<Schema>();

/**
 * Hook that returns the total count of all businesses.
 * 
 * @returns {number} The total number of businesses in the database
 */
export const useCountTotalBusinesses = () => {
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

/**
 * Hook that returns the count of businesses with a "FLAGGED" status.
 * 
 * @returns {number} The number of flagged businesses
 */
export const useCountTotalFlaggedBusinesses = () => {
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

/**
 * Hook that returns the count of businesses with a "VERIFIED" status.
 * 
 * @returns {number} The number of verified businesses
 */
export const useCountTotalVerifiedBusinesses = () => {
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

/**
 * Hook that returns the count of businesses with a "PENDING_REVIEW" status.
 * 
 * @returns {number} The number of businesses pending review
 */
export const useCountTotalPendingReviewBusinesses = () => {
  const [verifiedCount, setVerifiedCount] = useState(0);

  useEffect(() => {
      const fetchVerifiedCount = async () => {
          try {
              const result = await client.models.Business.list({
                  filter: { status: { eq: "PENDING_REVIEW" } }
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

/**
 * Hook to fetch a list of businesses without user information.
 * 
 * @returns {Object} Object containing:
 *   - businesses: Array of business objects without user details
 *   - loading: Boolean indicating if data is being fetched
 *   - error: Error message if fetch failed, or null if successful
 */
export const useFetchBusinessList = () => {
  const [businesses, setBusinesses] = useState<ResolvedBusiness[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const result = await client.models.Business.list({
          selectionSet: [
            "id",
            "name",
            "userId",
            "description",
            "category",
            "location.streetAddress",
            "location.secondaryAddress",
            "location.city",
            "location.state",
            "location.zip",
            "phone",
            "website",
            "email",
            "hours",
            "profilePhoto",
            "isMinorityOwned",
            "status",
            "averageRating",
            "createdAt",
            "updatedAt",
          ],
        });

        setBusinesses(result.data as ResolvedBusiness[]);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        setError("Failed to fetch businesses");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return { businesses, loading, error };
}

/**
 * Extended version of useFetchBusinessList that also loads user information.
 * This hook fetches businesses with their associated user data.
 * 
 * @returns {Object} Object containing:
 *   - businesses: Array of business objects with user details
 *   - loading: Boolean indicating if data is being fetched
 *   - error: Error message if fetch failed, or null if successful
 */
export const useFetchBusinessListEx = () => {
  const [businesses, setBusinesses] = useState<ResolvedBusinessEx[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // Fetch businesses with fields that match the actual schema
        const result = await client.models.Business.list({
          selectionSet: [
            "id",
            "name",
            "userId",
            "description",
            "category",
            "location.streetAddress",
            "location.secondaryAddress",
            "location.city",
            "location.state",
            "location.zip",
            "phone",
            "website",
            "email",
            "hours",
            "profilePhoto",
            "isMinorityOwned",
            "status",
            "averageRating",
            "createdAt",
            "updatedAt",
            "user.profileOwner",
            "user.id",
            "user.username",
            "user.firstName",
            "user.lastName",
          ],
        });

        // Resolve the user field if it's a LazyLoader
        const businessesWithUsers = await Promise.all(
          result.data.map(async (business) => {
            let resolvedUser = business.user;

            // Resolve the user if it's a LazyLoader
            if (resolvedUser && typeof resolvedUser === "object" && "then" in resolvedUser) {
              resolvedUser = await resolvedUser;
            }

            // Create a new object with the resolved user field
            return {
              ...business,
              user: resolvedUser,
            };
          })
        );

        setBusinesses(businessesWithUsers as ResolvedBusinessEx[]);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        setError("Failed to fetch businesses");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return { businesses, loading, error };
};
