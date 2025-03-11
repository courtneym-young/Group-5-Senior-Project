import { useTheme } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { View, Text, Heading, Button } from "@aws-amplify/ui-react";

export const CustomAuth = {
  Header() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Heading level={5} fontWeight="bold">
          User Sign Up
        </Heading>
      </View>
    );
  },
  Footer() {
    return (
      <View textAlign="center" padding="16px 0">
        <Text color="neutral.80">&copy; Your Company 2025</Text>
      </View>
    );
  },
  SignUp: {
    Header() {
      return (
        <Heading level={5} fontWeight="bold" textAlign="center">
          Create a new account
        </Heading>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toSignIn}
            size="small"
            variation="link"
          >
            Already have an account? Login
          </Button>
        </View>
      );
    },
  },
  SignIn: {
    Header() {
      return (
        <Heading level={5} fontWeight="bold" textAlign="center">
          Login to your Crossroad's Account
        </Heading>
      );
    },
    Footer() {
      const { toForgotPassword } = useAuthenticator();
      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toForgotPassword}
            size="small"
            variation="link"
          >
            Forgot Password?
          </Button>
        </View>
      );
    },
  },
};

export const formFields = {
  signIn: {
    username: {
      placeholder: "Enter your email",
    },
  },
  signUp: {
    email: {
      order: 1,
      label: "Enter your email",
      placeholder: "Enter your email",
      isRequired: true,
    },
    given_name: {
      order: 2,
      label: "Enter your first name",
      placeholder: "Enter your first name",
      isRequired: true,
    },
    family_name: {
      order: 3,
      label: "Enter your last name",
      placeholder: "Enter your last name",
      isRequired: true,
    },
    birthdate: {
      order: 4,
      label: "Enter your birthdate",
      placeholder: "Enter your birthdate",
      isRequired: true,
    },
    preferred_username: {
      order: 5,
      label: "Enter your username",
      placeholder: "Enter your username",
      isRequired: true,
    },
    password: {
      order: 6,
      label: "Enter your password",
      placeholder: "Enter your password",
      isRequired: true,
    },
    confirm_password: {
      order: 7,
      label: "Confirm your password",
      placeholder: "Confirm your password",
      isRequired: true,
    },
  },
  forceNewPassword: {
    password: {
      placeholder: "Enter your Password:",
    },
  },
  forgotPassword: {
    username: {
      placeholder: "Enter your email:",
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      placeholder: "Enter your Confirmation Code:",
      label: "Confirmation Code",
      isRequired: false,
    },
    confirm_password: {
      placeholder: "Enter your Password Please:",
    },
  },
  setupTotp: {
    QR: {
      totpIssuer: "test issuer",
      totpUsername: "amplify_qr_test_user",
    },
    confirmation_code: {
      label: "New Label",
      placeholder: "Enter your Confirmation Code:",
      isRequired: false,
    },
  },
  confirmSignIn: {
    confirmation_code: {
      label: "New Label",
      placeholder: "Enter your Confirmation Code:",
      isRequired: false,
    },
  },
};
