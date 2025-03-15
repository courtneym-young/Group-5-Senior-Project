import { signUp, SignUpInput } from "aws-amplify/auth";

const services = {
  async handleSignUp(input: SignUpInput) {
    const { username, password, options } = input;

    const firstName = options?.userAttributes.given_name ?? ""
    const lastName = options?.userAttributes.family_name ?? ""
    const birthdate = options?.userAttributes.birthdate ?? ""
    const preferredUsername = options?.userAttributes.preferred_username ?? ""


    console.log(username, password, options)

    return signUp({
      username,
      password,
      options: {
        ...input.options,
        userAttributes: {
          ...input.options?.userAttributes,
          given_name: firstName,
          family_name: lastName,
          birthdate: birthdate,
          preferred_username: preferredUsername
        },
      },
    });
  },
};

export default services;
