import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";

interface UserPageProps {}

const UsersPage: FunctionComponent<UserPageProps> = () => {
  const { userId } = useParams<{ userId?: string }>();

  return (
    <div className="p-4">
      {userId ? (
        <h1>Showing data for User ID: {userId}</h1>
      ) : (
        <h1>Welcome to the User Page</h1>
      )}
    </div>
  );
};

export default UsersPage;
