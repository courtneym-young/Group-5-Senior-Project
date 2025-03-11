import { useLocation, Navigate } from "react-router";
import { AuthUser } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { isUserInGroup } from "../utils/permissionsCheck";
import { GroupType, GroupRoles } from "../types/group-types";

export type ProtectedRouteProps = {
  user: AuthUser | null;
  requiredGroup: GroupType;
  redirectPath?: string;
  children?: React.ReactNode;
};

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectPath = "/",
  userGroups,
}: {
  children: JSX.Element;
  allowedRoles: GroupRoles[];
  redirectPath?: string;
  userGroups: string[];
}) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const location = useLocation();

  if (!user) {
    // Not authenticated, redirect to home with return URL
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if user has any of the allowed roles
  const hasPermission = allowedRoles.some((role) =>
    isUserInGroup(userGroups, role)
  );

  if (!hasPermission) {
    // Authenticated but not authorized, redirect to appropriate dashboard
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return children;
};
