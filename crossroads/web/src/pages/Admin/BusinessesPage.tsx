import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";

interface BusinessesPageProps {}

const BusinessesPage: FunctionComponent<BusinessesPageProps> = () => {
  const { businessId } = useParams<{ businessId?: string }>();
  return (
    <div className="p-4">
      {businessId ? (
        <h1>Showing data for Business ID: {businessId}</h1>
      ) : (
        <div>
          <h1>Welcome to the Business Page</h1>
        </div>
      )}
    </div>
  );
};

export default BusinessesPage;
