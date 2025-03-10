import type { PreSignUpTriggerHandler } from "aws-lambda";

function isOlderThan(date: Date, age: number) {
  const comparison = new Date();
  comparison.setFullYear(comparison.getFullYear() - age);
  return date.getTime() < comparison.getTime();
}

export const handler: PreSignUpTriggerHandler = async (event) => {
  const birthdate = new Date(event.request.userAttributes["birthdate"]);

  if (!isOlderThan(birthdate, 13)) {
    console.log(birthdate);
    throw new Error("You must be 13 years or older to use this site");
  }

  return event;
};
