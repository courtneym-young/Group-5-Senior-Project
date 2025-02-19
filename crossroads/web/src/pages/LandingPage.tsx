import { FunctionComponent } from "react";
import { AuthUser } from "aws-amplify/auth";
interface Props {
  user: AuthUser;
}
const LandingPage: FunctionComponent<Props> = (props: Props) => {
  console.log(props.user)
  return (
    <div>
      <h1>
        Welcome{" "}
        {props.user?.signInDetails?.loginId || "😔 where is your loginID???"}
      </h1>
    </div>
  );
};

export default LandingPage;
