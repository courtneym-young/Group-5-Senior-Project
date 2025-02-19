import { useAuthenticator } from "@aws-amplify/ui-react";
import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import BusinessOwnerPage from "./pages/BusinessOwnerPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { GroupRoles } from "./types/group-types";


function App() {
  const { user } = useAuthenticator();
  const { signOut } = useAuthenticator();

  return (
    <>
    <Routes>
      <Route index element={<LandingPage user={user} />} />
      <Route
        path="my-business"
        element={
          <ProtectedRoute
            redirectPath="/"
            user={user}
            requiredGroup={GroupRoles.BUSINESS_OWNER}
          >
            <BusinessOwnerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute user={user} requiredGroup={GroupRoles.ADMIN}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<p>There's nothing here: 404!</p>} />
    </Routes>
    <button onClick={signOut}>Sign out</button>
    </>
  );
}

export default App;
