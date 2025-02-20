import { useEffect, useState, useCallback } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import AdminPage from "./pages/AdminPage";
import { fetchUserGroups } from "./utils/fetchUserInfo";
import { isUserInGroup } from "./utils/permissionsCheck";
import { GroupRoles } from "./types/group-types";

function App() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [hasCheckedAdminStatus, setHasCheckedAdminStatus] = useState(false);

  const getUserGroups = useCallback(async () => {
    if (user) {
      const groups = await fetchUserGroups();
      setUserGroups(groups);
      const adminStatus = isUserInGroup(groups, GroupRoles.ADMIN);
      setIsAdmin(adminStatus);
      setHasCheckedAdminStatus(true);
    } else {
      setUserGroups([]);
      setIsAdmin(null);
      setHasCheckedAdminStatus(false);
    }
  }, [user]);

  useEffect(() => {
    getUserGroups();
  }, [getUserGroups]);

  useEffect(() => {
    if (user && isAdmin === false && hasCheckedAdminStatus) {
      alert("Unauthorized access group! Signing out.");
      signOut();
    }
  }, [isAdmin, user, signOut, hasCheckedAdminStatus]);

  if (
    isAdmin === null ||
    (user && isAdmin === false && hasCheckedAdminStatus)
  ) {
    return null;
  }

  if (user && isAdmin === true) {
    return (
      <>
        <p>Logged in as: {user.username}</p>
        <p>
          User Groups: {userGroups.length > 0 ? userGroups.join(", ") : "None"}
        </p>
        <AdminPage />
        <button onClick={signOut}>Sign out</button>
      </>
    );
  }

  return null;
}

export default App;
