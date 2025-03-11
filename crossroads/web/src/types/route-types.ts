export type ProtectedRouteProps = {
  isAllowed: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
};

export type AdminRoutes = {
  BASE: string,
  USERS: string;
  BUSINESSES: string;
  LOGS: string;
  REVIEWS: string;
  CROSSROADS_SETTINGS: string;
};

export type BusinessOwnerRoutes = {
  BASE: string,
  MY_BUSINESS: string;
};

export type CustomerRoutes = {
  EXPLORE: string;
  MY_REVIEWS: string;
  SUBSCRIPTIONS: string;
};