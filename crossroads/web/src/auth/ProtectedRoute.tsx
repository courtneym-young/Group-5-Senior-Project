import { useLocation, Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { AuthUser } from "aws-amplify/auth";
import { fetchUserGroups } from "../utils/fetchUserInfo";
import { isUserInGroup } from "../utils/permissionsCheck";
import { GroupType } from "../types/group-types";

export type ProtectedRouteProps = {
  user: AuthUser | null;
  requiredGroup: GroupType;
  redirectPath?: string;
  children?: React.ReactNode;
};

export const ProtectedRoute = ({
  user,
  requiredGroup,
  redirectPath = "/",
  children,
}: ProtectedRouteProps) => {
  const location = useLocation(); // Use useLocation to get current location
  const [isAllowed, setIsAllowed] = useState(false); // State to track permission
  const [userGroups, setUserGroups] = useState<string[]>([]);

  useEffect(() => {
    async function getUserGroups() {
      if (user) {
        const groups = await fetchUserGroups();
        setUserGroups(groups);
      } else {
        setUserGroups([]);
      }
    }

    getUserGroups();
  }, [user]);

  useEffect(() => {
    if (user) {
      setIsAllowed(isUserInGroup(userGroups, requiredGroup));
    } else {
      setIsAllowed(false); // Not allowed if no user
    }
  }, [user, userGroups, requiredGroup]);

  if (!isAllowed) {
    alert(
      "Your current authentication level is not enough to access this resource."
    );
    return <Navigate to={redirectPath} state={{ from: location }} replace />; // Use location state
  }

  return children ? children : <Outlet />;
};
