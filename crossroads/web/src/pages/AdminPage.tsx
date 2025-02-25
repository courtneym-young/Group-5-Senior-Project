import { FunctionComponent } from "react";
import OverviewStats from "../components/OverviewStats";
import UserList from "../components/UserList";
import BusinessTable from "../components/BusinessTable";
// import Header from "../components/Header";

interface AdminPageProps {
  username: string;
  signOut: () => void;
}

const AdminPage: FunctionComponent<AdminPageProps> = ({ username, signOut }) => {
  return (
    <div>
      {/* <Header username={username} signOut={signOut} /> */}
      <OverviewStats />
      <UserList />
      <BusinessTable />
    </div>
  );
};

export default AdminPage;