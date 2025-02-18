import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";
import { preSignUp } from "./pre-sign-up/resource";
import { addUserToGroup } from "../data/add-user-to-group/resource";

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to my CrossRoads",
      verificationEmailBody: (createCode) =>
        `Use this code to confirm your account: ${createCode()}`,
      userInvitation: {
        emailSubject: "Welcome to Crossroads!",
        emailBody: (user, code) =>
          `We're happy to have you! You can now login with username ${user()} and temporary password ${code()}`,
      },
    },
  },
  userAttributes: {
    givenName: {
      mutable: true,
      required: true,
    },
    familyName: {
      mutable: true,
      required: true,
    },
    birthdate: {
      mutable: true,
      required: true,
    },
    preferredUsername: {
      mutable: true,
      required: true,
    },
  },
  groups: ["ADMINS", "CUSTOMERS", "OWNERS"],

  triggers: {
    postConfirmation,
    preSignUp,
  },
  access: (allow) => [
    allow.resource(postConfirmation).to(["addUserToGroup"]),
    allow.resource(addUserToGroup).to(["addUserToGroup"]),
  ],
});
