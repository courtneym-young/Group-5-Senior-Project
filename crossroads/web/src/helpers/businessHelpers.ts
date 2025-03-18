import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import {
  ResolvedBusiness,
  ResolvedBusinessEx,
  BusinessStatusTypes,
  CreateBusinessAsUserFormData,
  CreateBusinessAsAdminFormData,
} from "../types/business-types";
import { fetchUserAttributes } from "aws-amplify/auth";

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
          filter: { status: { eq: "FLAGGED" } },
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
          filter: { status: { eq: "VERIFIED" } },
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
          filter: { status: { eq: "PENDING_REVIEW" } },
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
};

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
            if (
              resolvedUser &&
              typeof resolvedUser === "object" &&
              "then" in resolvedUser
            ) {
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

/**
 * Creates a new business for the currently authenticated user.
 *
 * @param businessData The business data provided by the user via the form.
 * @returns {Promise<object>} The created business object or an error.
 */
export const useCreateBusinessAsUser = async (
  businessData: CreateBusinessAsUserFormData
) => {
  // Fetch the currently authenticated user
  const userAttributes = await fetchUserAttributes();
  const userId = userAttributes?.sub; // The user's unique ID

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Create the business in the database
  const task = await client.models.Business.create({
    name: businessData.name,
    userId, // Link business to the authenticated user
    description: businessData.description || "",
    category: businessData.category || [],
    location: businessData.location,
    phone: businessData.phone || "",
    website: businessData.website || "",
    email: businessData.email || "",
    hours: businessData.hours || "",
    profilePhoto: businessData.profilePhoto || "",
    isMinorityOwned: businessData.isMinorityOwned || false,
    status: BusinessStatusTypes.PENDING, // Default new businesses to pending review
    averageRating: 0,
  });

  if ((task.errors?.length ?? 0) > 0) {
    console.error(task.errors?.[0].message || "An unknown error occurred");
    throw new Error(task.errors?.[0].message || "An unknown error occurred");
  }
};

/**
 * Admin function to create a new business and assign it to a user.
 *
 * @param businessData The business data provided by the admin.
 * @returns {Promise<object>} The created business object or an error.
 */
export const createBusinessAsAdmin = async (
  businessData: CreateBusinessAsAdminFormData
) => {
  try {
    if (!businessData.userId) {
      throw new Error("User ID is required to assign the business.");
    }

    // Create the business in the database
    const task = await client.models.Business.create({
      name: businessData.name,
      userId: businessData.userId, // Assign to the specified user
      description: businessData.description || "",
      category: businessData.category || [],
      location: businessData.location,
      phone: businessData.phone || "",
      website: businessData.website || "",
      email: businessData.email || "",
      hours: businessData.hours || "",
      profilePhoto: businessData.profilePhoto || "",
      isMinorityOwned: businessData.isMinorityOwned || false,
      status: BusinessStatusTypes.PENDING, // Admin can review businesses after creation
      averageRating: 0,
    });

    if ((task.errors?.length ?? 0) > 0) {
      throw new Error(task.errors?.[0].message || "An unknown error occurred");
    }
    return task;
  } catch (error) {
    console.error("Error creating business as admin:", error);
    throw new Error("Failed to create business as admin");
  }
};

/**
 * Hook that allows a user to update their own business.
 * Users can only update businesses they own and cannot modify status or user association.
 *
 * @param businessId The ID of the business to update
 * @param updatedData The updated business data
 * @returns {Promise<object>} The updated business object or an error
 */
export const useUpdateBusinessAsUser = async (
  businessId: string,
  updatedData: CreateBusinessAsUserFormData
) => {
  try {
    const userAttributes = await fetchUserAttributes();
    const userId = userAttributes?.sub;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingBusiness = await client.models.Business.get({
      id: businessId,
    });
    if (!existingBusiness || existingBusiness?.data?.userId !== userId) {
      throw new Error("Unauthorized to update this business");
    }

    return await client.models.Business.update({
      id: businessId,
      name: updatedData.name,
      description: updatedData.description,
      category: updatedData.category,
      location: updatedData.location,
      phone: updatedData.phone,
      website: updatedData.website,
      email: updatedData.email,
      hours: updatedData.hours,
      profilePhoto: updatedData.profilePhoto,
      isMinorityOwned: updatedData.isMinorityOwned,
    });
  } catch (error) {
    console.error("Error updating business:", error);
    throw new Error("Failed to update business");
  }
};

/**
 * Hook that allows an admin to update any business.
 * Admins can modify all fields including status and user association.
 *
 * @param businessId The ID of the business to update
 * @param updatedData The updated business data
 * @returns {Promise<object>} The updated business object or an error
 */
export const updateBusinessAsAdmin = async (
  businessId: string,
  updatedData: CreateBusinessAsAdminFormData
) => {
  try {
    return await client.models.Business.update({
      id: businessId,
      name: updatedData.name,
      userId: updatedData.userId,
      description: updatedData.description,
      category: updatedData.category,
      location: updatedData.location,
      phone: updatedData.phone,
      website: updatedData.website,
      email: updatedData.email,
      hours: updatedData.hours,
      profilePhoto: updatedData.profilePhoto,
      isMinorityOwned: updatedData.isMinorityOwned,
      status: updatedData.status,
    });
  } catch (error) {
    console.error("Error updating business as admin:", error);
    throw new Error("Failed to update business as admin");
  }
};

/**
 * Hook that allows a user to delete their own business.
 * Users can only delete businesses they own.
 *
 * @param businessId The ID of the business to delete
 * @returns {Promise<object>} The deleted business object or an error
 */
export const useDeleteBusinessAsUser = async (businessId: string) => {
  try {
    const userAttributes = await fetchUserAttributes();
    const userId = userAttributes?.sub;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingBusiness = await client.models.Business.get({
      id: businessId,
    });
    if (!existingBusiness || existingBusiness?.data?.userId !== userId) {
      throw new Error("Unauthorized to delete this business");
    }

    return await client.models.Business.delete({
      id: businessId,
    });
  } catch (error) {
    console.error("Error deleting business:", error);
    throw new Error("Failed to delete business");
  }
};

/**
 * Hook that allows an admin to delete any business.
 *
 * @param businessId The ID of the business to delete
 * @returns {Promise<object>} The deleted business object or an error
 */
export const deleteBusinessAsAdmin = async (businessId: string) => {
  try {
    return await client.models.Business.delete({
      id: businessId,
    });
  } catch (error) {
    console.error("Error deleting business as admin:", error);
    throw new Error("Failed to delete business as admin");
  }
};
