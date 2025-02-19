import React from "react";
import { Button, View, StyleSheet } from "react-native";

import { Amplify } from "aws-amplify";
import {
  Authenticator,
  useAuthenticator,
  useTheme,
} from "@aws-amplify/ui-react-native";
import outputs from "../../amplify_outputs.json";
import services from "@/auth/CustomServices";
import { AuthHeader, AuthFooter } from "@/auth/AuthConfiguration";

Amplify.configure(outputs);

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default function HomeScreen() {
  const {
    tokens: { colors },
  } = useTheme();

  return (
    <Authenticator.Provider>
      <Authenticator
        Container={(props) => (
          <Authenticator.Container
            {...props}
            style={{ backgroundColor: colors.white[20] }}
          />
        )}
        Header={AuthHeader}
        Footer={AuthFooter}
        services={services}
        components={{
          SignUp: ({ fields, ...props }) => (
            <Authenticator.SignUp
              {...props}
              fields={[
                ...fields,
                {
                  name: "email",
                  label: "Enter your email",
                  type: "email",
                  placeholder: "Enter your email",
                  required: true,
                },
                {
                  name: "given_name",
                  label: "Enter your first name",
                  type: "default",
                  placeholder: "Enter your first name",
                  required: true,
                },
                {
                  name: "family_name",
                  label: "Enter your last name",
                  type: "default",
                  placeholder: "Enter your last name",
                  required: true,
                },
                {
                  name: "birthdate",
                  label: "Enter your birthdate (mm/dd/yyyy)",
                  type: "default",
                  placeholder: "Enter your birthdate",
                  required: true,
                },
                {
                  name: "preferred_username",
                  label: "Preferred Username",
                  type: "default",
                  placeholder: "Enter your preferred username",
                },
                {
                  name: "password",
                  label: "Enter your password",
                  type: "password",
                  placeholder: "Enter your password",
                  required: true,
                },
                {
                  name: "confirm_password",
                  label: "Confirm your password",
                  type: "password",
                  placeholder: "Confirm your password",
                  required: true,
                },
              ]}
            />
          ),
        }}
      >
        <SignOutButton />
      </Authenticator>
    </Authenticator.Provider>
  );
}

const styles = StyleSheet.create({
  signOutButton: {
    alignSelf: "flex-end",
  },
});
