import { FunctionComponent } from "react";
import OverviewStats from "../components/OverviewStats";
import BusinessTable from "../components/BusinessTable";

interface AdminPageProps {
  username: string;
  signOut: () => void;
}

const AdminPage: FunctionComponent<AdminPageProps> = () => {
  return (
    <div className="p-4">
      <OverviewStats />
      <div className="pt-4">
        <BusinessTable />
      </div>
    </div>
  );
};

export default AdminPage;
