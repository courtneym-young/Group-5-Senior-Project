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