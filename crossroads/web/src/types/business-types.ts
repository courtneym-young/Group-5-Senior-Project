export type BusinessStatusType = "PENDING_REVIEW" | "FLAGGED" | "VERIFIED";

export const enum BusinessStatusTypes {
  PENDING = "PENDING_REVIEW",
  FLAGGED = "FLAGGED",
  VERIFIED = "VERIFIED",
}

export type BusinessUser = {
  id: string;
  profileOwner: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
};

export type Location = {
  streetAddress?: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type BusinessLocation = {
  streetAddress?: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type ResolvedProduct = {
  id: string;
  businessId: string;
  productName: string;
  productDescription: string[];
  productImage: string;
  createdAt?: string;
  updatedAt?: string;
  price: number;
};

export type Product = {
  id: string, 
  businessId: string;
  productName: string;
  productDescription: string[];
  productImage: string;
  createdAt?: string;
  updatedAt?: string;
  price: number;
};

export type BusinessOwnerPost = {
  id: string;
  userId: string;
  businessId: string;
  content: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  user?: BusinessUser; // Add the user reference to match the data model
};

export type Review = {
  id: string;
  businessId: string;
  userId: string;
  rating: number;
  text?: string;
  images?: string[];
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: BusinessUser;
};

export type UserBusinessSubscription = {
  id: string;
  userId: string;
  businessId: string;
  subscribedAt: string;
  user?: BusinessUser;
};

export type ResolvedBusiness = {
  id: string;
  name: string;
  userId: string;
  description?: string;
  category?: string[];
  location?: BusinessLocation;
  phone?: string;
  website?: string;
  email?: string;
  hours?: string;
  profilePhoto?: string;
  isMinorityOwned?: boolean;
  status?: BusinessStatusType;
  averageRating?: number;
  createdAt?: string;
  updatedAt?: string;
  businessProducts?: Product[];
  businessOwnerPosts?: BusinessOwnerPost[];
  reviews?: Review[];
  subscribers?: UserBusinessSubscription[];
};

export type ResolvedBusinessEx = ResolvedBusiness & {
  user: BusinessUser | null;
};

export type CreateBusinessBase = {
  name: string;
  description?: string;
  category?: string[];
  location: Location;
  phone?: string;
  website?: string;
  email?: string;
  hours?: string;
  profilePhoto?: string;
  isMinorityOwned?: boolean;
};

export type CreateBusinessAsUserFormData = CreateBusinessBase;

export type CreateBusinessAsAdminFormData = CreateBusinessBase & {
  userId: string; // Admin must specify the user ID
  status: BusinessStatusType
};

export const emptyBusiness = {
  name: "",
  userId: "",
  description: "",
  category: [],
  location: {
    streetAddress: "",
    secondaryAddress: "",
    city: "",
    state: "",
    zip: ""
  },
  phone: "",
  website: "",
  email: "",
  hours: "",
  profilePhoto: "",
  isMinorityOwned: false,
  status: BusinessStatusTypes.PENDING
};