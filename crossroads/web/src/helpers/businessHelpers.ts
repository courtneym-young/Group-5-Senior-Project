import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import {
  ResolvedBusiness,
  ResolvedBusinessEx,
  BusinessStatusTypes,
  CreateBusinessAsUserFormData,
  CreateBusinessAsAdminFormData,
  ResolvedProduct,
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
            "businessProducts.*",
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
 * Hook to fetch a list of products.
 *
 * @returns {Object} Object containing:
 *   - products: Array of product objects
 *   - loading: Boolean indicating if data is being fetched
 *   - error: Error message if fetch failed, or null if successful
 */
  export const useFetchProductList = () => {
    const [products, setProducts] = useState<ResolvedProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchProductList = async () => {
        try {
          const result = await client.models.Product.list({
            selectionSet: [
              "businessId",
              "productName",
              "productDescription",
              "productImage",
              "price",
              "createdAt",
              "updatedAt",
            ],
          });
  
          setProducts(result.data as ResolvedProduct[]);
        } catch (error) {
          console.error("Error fetching products:", error);
          setError("Failed to fetch products");
        } finally {
          setLoading(false);
        }
      };
  
      fetchProductList();
    }, []);
  
    return { products, loading, error };
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
            "businessProducts.*",
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
  const userSub = userAttributes?.sub?.trim() ?? ""; // The user's unique ID

  if (!userSub) {
    throw new Error("User not authenticated");
  }

  const usersList = await client.models.User.list({
    filter: { profileOwner: { eq: userSub } },
  });

  if (!usersList.data || usersList.data.length === 0) {
    throw new Error("User profile not found");
  }

  const userId = usersList.data[0].id;

  // Create the business in the database
  const task = await client.models.Business.create({
    name: businessData.name,
    userId,
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

export const useFetchBusinessById = (businessId: string) => {
  const [business, setBusiness] = useState<ResolvedBusinessEx | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = async () => {
    if (!businessId) {
      setError("Business ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch the business with all relevant fields
      const result = await client.models.Business.get({
        id: businessId}, {
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
          // User details
          "user.id",
          "user.profileOwner",
          "user.username",
          "user.firstName",
          "user.lastName",
          "user.groupName",
          "user.profilePhoto",
          // Business owner posts
          "businessOwnerPosts.id",
          "businessOwnerPosts.userId",
          "businessOwnerPosts.businessId",
          "businessOwnerPosts.content",
          "businessOwnerPosts.images",
          "businessOwnerPosts.createdAt",
          "businessOwnerPosts.updatedAt",
          "businessOwnerPosts.user.username",
          "businessOwnerPosts.user.firstName",
          "businessOwnerPosts.user.lastName",
          "businessOwnerPosts.user.profilePhoto",
          // Products
          "businessProducts.id",
          "businessProducts.businessId",
          "businessProducts.productName",
          "businessProducts.productDescription",
          "businessProducts.productImage",
          "businessProducts.price",
          "businessProducts.createdAt",
          "businessProducts.updatedAt",
          // Reviews
          "reviews.id",
          "reviews.businessId",
          "reviews.userId",
          "reviews.rating",
          "reviews.text",
          "reviews.images",
          "reviews.isPublic",
          "reviews.createdAt",
          "reviews.updatedAt",
          "reviews.user.username",
          "reviews.user.firstName",
          "reviews.user.lastName",
          "reviews.user.profilePhoto",
          // Subscribers
          "subscribers.id",
          "subscribers.userId",
          "subscribers.businessId",
          "subscribers.subscribedAt",
          "subscribers.user.username",
          "subscribers.user.firstName",
          "subscribers.user.lastName"
        ],
      });

      if (!result.data) {
        setError("Business not found");
        setBusiness(null);
      } else {
        // Process the data to resolve any lazy-loaded properties
        const businessData = result.data;
        
        // Resolve user if it's a LazyLoader
        let resolvedUser = businessData.user;
        if (resolvedUser && typeof resolvedUser === "object" && "then" in resolvedUser) {
          resolvedUser = await resolvedUser;
        }
        
        // Resolve business owner posts if they're LazyLoaders
        let resolvedBusinessOwnerPosts = businessData.businessOwnerPosts || [];
        if (resolvedBusinessOwnerPosts && typeof resolvedBusinessOwnerPosts === "object" && "then" in resolvedBusinessOwnerPosts) {
          resolvedBusinessOwnerPosts = await resolvedBusinessOwnerPosts;
        }

        // Resolve business products if they're LazyLoaders
        let resolvedBusinessProducts = businessData.businessProducts || [];
        if (resolvedBusinessProducts && typeof resolvedBusinessProducts === "object" && "then" in resolvedBusinessProducts) {
          resolvedBusinessProducts = await resolvedBusinessProducts;
        }

        // Resolve reviews if they're LazyLoaders
        let resolvedReviews = businessData.reviews || [];
        if (resolvedReviews && typeof resolvedReviews === "object" && "then" in resolvedReviews) {
          resolvedReviews = await resolvedReviews;
        }

        // Resolve subscribers if they're LazyLoaders
        let resolvedSubscribers = businessData.subscribers || [];
        if (resolvedSubscribers && typeof resolvedSubscribers === "object" && "then" in resolvedSubscribers) {
          resolvedSubscribers = await resolvedSubscribers;
        }

        // For each review, ensure its user is resolved
        if (Array.isArray(resolvedReviews)) {
          resolvedReviews = await Promise.all(resolvedReviews.map(async (review) => {
            if (review.user && typeof review.user === "object" && "then" in review.user) {
              const resolvedUser = await review.user;
              return { ...review, user: resolvedUser };
            }
            return review;
          }));
        }

        // For each business owner post, ensure its user is resolved
        if (Array.isArray(resolvedBusinessOwnerPosts)) {
          resolvedBusinessOwnerPosts = await Promise.all(resolvedBusinessOwnerPosts.map(async (post) => {
            if (post.user && typeof post.user === "object" && "then" in post.user) {
              const resolvedUser = await post.user;
              return { ...post, user: resolvedUser };
            }
            return post;
          }));
        }

        // For each subscriber, ensure its user is resolved
        if (Array.isArray(resolvedSubscribers)) {
          resolvedSubscribers = await Promise.all(resolvedSubscribers.map(async (subscriber) => {
            if (subscriber.user && typeof subscriber.user === "object" && "then" in subscriber.user) {
              const resolvedUser = await subscriber.user;
              return { ...subscriber, user: resolvedUser };
            }
            return subscriber;
          }));
        }

        const completeBusinessData = {
          ...businessData,
          user: resolvedUser,
          businessOwnerPosts: resolvedBusinessOwnerPosts,
          businessProducts: resolvedBusinessProducts,
          reviews: resolvedReviews,
          subscribers: resolvedSubscribers
        };

        setBusiness(completeBusinessData as unknown as ResolvedBusinessEx);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching business by ID:", error);
      setError(`Failed to fetch business: ${error instanceof Error ? error.message : String(error)}`);
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  return { business, loading, error, refetch: fetchBusiness };
};

/**
 * Function to fetch a business by ID without using hooks
 * Useful for one-time fetches or in non-component contexts
 * 
 * @param businessId The ID of the business to fetch
 * @returns {Promise} The business data with all related information
 */
export const fetchBusinessById = async (businessId: string) => {
  if (!businessId) {
    throw new Error("Business ID is required");
  }

  try {
    const result = await client.models.Business.get({
      id: businessId,},{
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
        // User details
        "user.id",
        "user.profileOwner",
        "user.username",
        "user.firstName",
        "user.lastName",
        "user.groupName",
        "user.profilePhoto",
        // Business owner posts
        "businessOwnerPosts.id",
        "businessOwnerPosts.userId",
        "businessOwnerPosts.businessId",
        "businessOwnerPosts.content",
        "businessOwnerPosts.images",
        "businessOwnerPosts.createdAt",
        "businessOwnerPosts.updatedAt",
        "businessOwnerPosts.user.username",
        "businessOwnerPosts.user.firstName",
        "businessOwnerPosts.user.lastName",
        "businessOwnerPosts.user.profilePhoto",
        // Products
        "businessProducts.id",
        "businessProducts.businessId",
        "businessProducts.productName",
        "businessProducts.productDescription",
        "businessProducts.productImage",
        "businessProducts.price",
        "businessProducts.createdAt",
        "businessProducts.updatedAt",
        // Reviews
        "reviews.id",
        "reviews.businessId",
        "reviews.userId",
        "reviews.rating",
        "reviews.text",
        "reviews.images",
        "reviews.isPublic",
        "reviews.createdAt",
        "reviews.updatedAt",
        "reviews.user.username",
        "reviews.user.firstName",
        "reviews.user.lastName",
        "reviews.user.profilePhoto",
        // Subscribers
        "subscribers.id",
        "subscribers.userId",
        "subscribers.businessId",
        "subscribers.subscribedAt",
        "subscribers.user.username",
        "subscribers.user.firstName",
        "subscribers.user.lastName"
      ],
    });

    if (!result.data) {
      throw new Error("Business not found");
    }

    // Process the data to resolve any lazy-loaded properties
    const businessData = result.data;
    
    // Resolve user if it's a LazyLoader
    let resolvedUser = businessData.user;
    if (resolvedUser && typeof resolvedUser === "object" && "then" in resolvedUser) {
      resolvedUser = await resolvedUser;
    }
    
    // Resolve business owner posts if they're LazyLoaders
    let resolvedBusinessOwnerPosts = businessData.businessOwnerPosts || [];
    if (resolvedBusinessOwnerPosts && typeof resolvedBusinessOwnerPosts === "object" && "then" in resolvedBusinessOwnerPosts) {
      resolvedBusinessOwnerPosts = await resolvedBusinessOwnerPosts;
    }

    // Resolve business products if they're LazyLoaders
    let resolvedBusinessProducts = businessData.businessProducts || [];
    if (resolvedBusinessProducts && typeof resolvedBusinessProducts === "object" && "then" in resolvedBusinessProducts) {
      resolvedBusinessProducts = await resolvedBusinessProducts;
    }

    // Resolve reviews if they're LazyLoaders
    let resolvedReviews = businessData.reviews || [];
    if (resolvedReviews && typeof resolvedReviews === "object" && "then" in resolvedReviews) {
      resolvedReviews = await resolvedReviews;
    }

    // Resolve subscribers if they're LazyLoaders
    let resolvedSubscribers = businessData.subscribers || [];
    if (resolvedSubscribers && typeof resolvedSubscribers === "object" && "then" in resolvedSubscribers) {
      resolvedSubscribers = await resolvedSubscribers;
    }

    // For each review, ensure its user is resolved
    if (Array.isArray(resolvedReviews)) {
      resolvedReviews = await Promise.all(resolvedReviews.map(async (review) => {
        if (review.user && typeof review.user === "object" && "then" in review.user) {
          const resolvedUser = await review.user;
          return { ...review, user: resolvedUser };
        }
        return review;
      }));
    }

    // For each business owner post, ensure its user is resolved
    if (Array.isArray(resolvedBusinessOwnerPosts)) {
      resolvedBusinessOwnerPosts = await Promise.all(resolvedBusinessOwnerPosts.map(async (post) => {
        if (post.user && typeof post.user === "object" && "then" in post.user) {
          const resolvedUser = await post.user;
          return { ...post, user: resolvedUser };
        }
        return post;
      }));
    }

    // For each subscriber, ensure its user is resolved
    if (Array.isArray(resolvedSubscribers)) {
      resolvedSubscribers = await Promise.all(resolvedSubscribers.map(async (subscriber) => {
        if (subscriber.user && typeof subscriber.user === "object" && "then" in subscriber.user) {
          const resolvedUser = await subscriber.user;
          return { ...subscriber, user: resolvedUser };
        }
        return subscriber;
      }));
    }

    const completeBusinessData = {
      ...businessData,
      user: resolvedUser,
      businessOwnerPosts: resolvedBusinessOwnerPosts,
      businessProducts: resolvedBusinessProducts,
      reviews: resolvedReviews,
      subscribers: resolvedSubscribers
    };

    return completeBusinessData as unknown as ResolvedBusinessEx;
  } catch (error) {
    console.error("Error fetching business by ID:", error);
    throw error;
  }
};


/**
 * Creates a new product for a specific business.

export const useCreateProduct = async (productData: CreateProductFormData) => {
  try {
    // Create the product in the database
    const task = await client.models.Product.create({
      businessId: productData.businessId,
      productName: productData.productName,
      productDescription: productData.productDescription || "",
      productImage: productData.productImage,
      price: productData.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if ((task.errors?.length ?? 0) > 0) {
      throw new Error(task.errors?.[0].message || "An unknown error occurred");
    }
    return task;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};


 * Updates an existing product.
 
export const useUpdateProduct = async (
  productId: string,
  updatedData: CreateProductFormData
) => {
  try {
    return await client.models.Product.update({
      id: productId,
      productName: updatedData.productName,
      productDescription: updatedData.productDescription,
      productImage: updatedData.productImage,
      price: updatedData.price,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};

/**
 * Deletes a product.

export const useDeleteProduct = async (productId: string) => {
  try {
    return await client.models.Product.delete({ id: productId });
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

 **/