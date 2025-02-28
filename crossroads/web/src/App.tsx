import { useEffect, useState, useCallback } from "react";
// Pages
import Layout from "./components/shared/Layout";
import AdminPage from "./pages/AdminPage";
import UsersPage from "./pages/UsersPage";
import BusinessesPage from "./pages/BusinessesPage";
import PageNotFoundPage from "./pages/404Page";
// AWS Amplify
import { useAuthenticator } from "@aws-amplify/ui-react";
// Helpers
import { fetchUserGroups } from "./utils/fetchUserInfo";
import { isUserInGroup } from "./utils/permissionsCheck";
import { GroupRoles } from "./types/group-types";
import { ThemeProvider } from "./components/theme-provider";
// Routing
import { Routes, Route } from "react-router-dom";
import { APP_ROUTES } from "./config/UrlConfig";

function App() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [hasCheckedAdminStatus, setHasCheckedAdminStatus] = useState(false);

  const getUserGroups = useCallback(async () => {
    if (user) {
      console.log(userGroups);
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
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <AdminPage username={user?.username} signOut={signOut} />
                }
              />
              <Route path={APP_ROUTES.USERS} element={<UsersPage />} />
              <Route
                path={`${APP_ROUTES.USERS}/:userId`}
                element={<UsersPage />}
              />
              <Route
                path={APP_ROUTES.BUSINESSES}
                element={<BusinessesPage />}
              />
              <Route
                path={`${APP_ROUTES.BUSINESSES}/:businessId`}
                element={<BusinessesPage />}
              />
              <Route path={"*"} element={<PageNotFoundPage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </>
    );
  }

  return null;
}

export default App;
