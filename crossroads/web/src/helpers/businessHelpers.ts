import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();
type ResolvedBusiness = {
  id: string;
  name: string;
  businessId: string;
  description?: string;
  category?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  website?: string;
  email?: string;
  hours?: string;
  images?: string[];
  isMinorityOwned?: boolean;
  status: "PENDING_REVIEW" | "FLAGGED" | "VERIFIED" | null;
  averageRating?: number;
  numberOfRatings?: number;
  createdAt?: string;
  updatedAt?: string;
  user: {
    profileOwner: string;
    username: string;
    firstName: string;
    lastName: string;
    id: string,
  } | null;
};


export const useFetchBusinessList = () => {
  const [businesses, setBusinesses] = useState<ResolvedBusiness[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // Fetch businesses with eager loading of the `user` relationship
        const result = await client.models.Business.list({
          selectionSet: [
            "id",
            "name",
            "businessId",
            "description",
            "category",
            "address",
            "city",
            "state",
            "zip",
            "phone",
            "website",
            "email",
            "hours",
            "images",
            "isMinorityOwned",
            "status",
            "averageRating",
            "numberOfRatings",
            "createdAt",
            "updatedAt",
            "user.profileOwner", // Eager load user fields
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

        setBusinesses(businessesWithUsers as ResolvedBusiness[]);
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

// export const useFetchBusinessList = () => {
//   const [businesses, setBusinesses] = useState<
//     Array<Schema["Business"]["type"]>
//   >([]);

//   useEffect(() => {
//     const fetchBusinesses = async () => {
//       try {
//         const result = await client.models.Business.list();
//         setBusinesses(result.data);
//       } catch (error) {
//         console.error("Error fetching businesses:", error);
//       }
//     };
//     fetchBusinesses();
//   }, []);

//   return businesses;
// };

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