import { useEffect, useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

// Components
import Layout from "./components/shared/Layout";
import { ThemeProvider } from "./components/admin/theme-provider";
import { ProtectedRoute } from "./auth/ProtectedRoute";

// Phone Views
import Explore from "./components/mobile/Explore";
import Search from "./components/mobile/Search";
import AddBusiness from "./components/mobile/AddBusiness";
import Messages from "./components/mobile/Messages";
import Market from "./components/mobile/Market";

// Admin Pages
import AdminPage from "./pages/Admin/AdminPage";
import UsersPage from "./pages/Admin/UsersPage";
import BusinessesPage from "./pages/Admin/BusinessesPage";
import PageNotFoundPage from "./pages/404Page";

// Utils and Config
import { fetchUserGroups } from "./utils/fetchUserInfo";
import { isUserInGroup } from "./utils/permissionsCheck";
import { GroupRoles } from "./types/group-types";
import { APP_ROUTES } from "./config/UrlConfig";

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

  // Return null while loading user data
  if (!hasCheckedAdminStatus && user) {
    return null;
  }

  // Customer routes (non-admin authenticated users)
  if (user && isAdmin === false) {
    return (
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/search" element={<Search />} />
          <Route path="/add-business" element={<AddBusiness />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/market" element={<Market />} />
          <Route path="*" element={<PageNotFoundPage />} />
        </Routes>
    );
  }

  // Admin protected routes
  if (user && isAdmin) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path={APP_ROUTES.ADMIN.BASE}
              element={
                <ProtectedRoute
                  allowedRoles={[GroupRoles.ADMIN]}
                  userGroups={userGroups}
                >
                  <AdminPage username={user?.username} signOut={signOut} />
                </ProtectedRoute>
              }
            />
            <Route
              path={APP_ROUTES.ADMIN.USERS}
              element={
                <ProtectedRoute
                  allowedRoles={[GroupRoles.ADMIN]}
                  userGroups={userGroups}
                >
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${APP_ROUTES.ADMIN.USERS}/:userId`}
              element={
                <ProtectedRoute
                  allowedRoles={[GroupRoles.ADMIN]}
                  userGroups={userGroups}
                >
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={APP_ROUTES.ADMIN.BUSINESSES}
              element={
                <ProtectedRoute
                  allowedRoles={[GroupRoles.ADMIN]}
                  userGroups={userGroups}
                >
                  <BusinessesPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageNotFoundPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    );
  }

  // Return null for unauthenticated users or while determining admin status
  return <p> NOPE!! </p>;
}

export default App;
