import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";

const Layout: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-4 dark:bg-gray-900"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
