import { FunctionComponent } from "react";
import OverviewStats from "../components/OverviewStats";
import BusinessTable from "../components/BusinessTable";
import Header from "../components/Header";

interface AdminPageProps {
  username: string;
  signOut: () => void;
}

const AdminPage: FunctionComponent<AdminPageProps> = () => {
  return (
    <div>
      <Header />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-4 dark:bg-gray-900"
        >
          <div className="p-4">
            <OverviewStats />
            <div className="pt-4">
              <BusinessTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
