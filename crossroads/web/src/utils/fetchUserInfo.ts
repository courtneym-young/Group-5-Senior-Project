import { fetchAuthSession } from "aws-amplify/auth";

// TODO: fetchUserAttributes

export async function fetchUserGroups(): Promise<string[]> {
    try {
      const authSession = await fetchAuthSession();
  
      if (authSession.tokens && authSession.tokens.accessToken) {
        const groups = authSession.tokens.accessToken.payload["cognito:groups"];
  
        // Handle the case where groups might be null or undefined
        if (groups == null) {  // Use == to check for both null and undefined
          return [];
        }
  
        if (Array.isArray(groups)) {
          return groups.map(String); // Ensure all elements are strings
        } else if (typeof groups === "string") {
          return [groups];
        } else {
          console.warn(
            "cognito:groups is not an array or string. Unexpected type:",
            typeof groups
          );
          return [];
        }
      } else {
        console.warn("No access token found in auth session.");
        return [];
      }
    } catch (error: unknown) {
      console.error("Error fetching auth session:", error);
      return [];
    }
  }