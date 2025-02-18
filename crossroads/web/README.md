# Crossroads Backend Development  

## Overview  
This repository contains the backend infrastructure for the Crossroads platform, built using AWS Amplify. It includes:  

- **Authentication**: User sign-up, sign-in, and role-based access control (RBAC).  
- **Data**: Models for businesses, reviews, and user data.  
- **Authorization**: Permissions for different user groups (Admins, Customers, Business Owners).  

---

## Local Development 
(Our IAM works finally :D)

## Styling Resources
[Master Styling Guide](https://ui.docs.amplify.aws/)  
[Auth Styling Guide](https://ui.docs.amplify.aws/react/connected-components/authenticator/customization)  



## Authentication & User Groups
### User Groups & Permissions
https://docs.amplify.aws/react/build-a-backend/data/customize-authz/ (Auth rules)
https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/ (Group basded access)

Crossroads uses [AWS Cognito User Groups](https://docs.amplify.aws/react/build-a-backend/auth/concepts/user-groups/) to manage roles and restrict access.


| Role        | Permissions                                      |
|-------------|--------------------------------------------------|
| ADMINS      | Full access to all businesses & users          |
| BUSINESS_OWNERS | Manage their own business listings, reviews & promotions |
| CUSTOMERS (Default)  | Can view businesses & write reviews             |

**When a user is confirmed we will [automatically assign](https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/) them the role of Customer.**


The default behavior of Gen2 is to enable [guest accounts](https://docs.amplify.aws/react/build-a-backend/auth/concepts/guest-access/), we have disabled this for now. Who should access our data?? https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/




Admins can [manage users](https://docs.amplify.aws/react/build-a-backend/auth/manage-users/with-admin-actions/)



## Data Modeling

https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/ (Custom business logic)


### User Data Model
Created a user data model that makes use of [user attributes](https://docs.amplify.aws/react/build-a-backend/auth/concepts/user-attributes/) in order to track user information.

When a user is confirmed we [validate the user's attributes](https://docs.amplify.aws/react/build-a-backend/functions/examples/user-attribute-validation/) and [automatically create a user profile record.](https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/)



Modeling relationships https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/
https://docs.amplify.aws/react/build-a-backend/data/data-modeling/




https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/ (All fields)

https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/ (Identifiers)

https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/





### Resources

Additional Login Methods https://docs.amplify.aws/react/build-a-backend/auth/concepts/



User: List of subscribed businesses 
Resources: 

Additional Features (Maybe)
https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/



Console tools:
https://docs.amplify.aws/react/build-a-backend/auth/manage-users/with-amplify-console/
https://docs.amplify.aws/react/build-a-backend/auth/grant-access-to-auth-resources/ (More auth resources)

https://docs.amplify.aws/react/build-a-backend/auth/manage-users/manage-devices/ (Device management)

https://docs.amplify.aws/react/build-a-backend/auth/reference/ (Auth API reference)

User: List of subscribed businesses 
Resources: 


Writing data to backend 
https://docs.amplify.aws/react/build-a-backend/data/set-up-data/#write-data-to-your-backend
https://docs.amplify.aws/react/build-a-backend/data/set-up-data/#read-data-from-your-backend
https://docs.amplify.aws/react/build-a-backend/data/set-up-data/#subscribe-to-real-time-updates



https://docs.amplify.aws/react/build-a-backend/data/mutate-data/ (CRUD data)
https://docs.amplify.aws/react/build-a-backend/data/query-data/ (Query Data)
https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/ (Always updationg data)

https://docs.amplify.aws/react/build-a-backend/data/manage-with-amplify-console/ Create data on console
https://docs.amplify.aws/react/build-a-backend/data/enable-logging/ Logging





Storage
https://docs.amplify.aws/react/build-a-backend/storage/set-up-storage/
https://docs.amplify.aws/react/build-a-backend/data/working-with-files/
https://docs.amplify.aws/react/build-a-backend/storage/authorization/
https://docs.amplify.aws/react/build-a-backend/storage/upload-files/
https://docs.amplify.aws/react/build-a-backend/storage/download-files/
https://docs.amplify.aws/react/build-a-backend/storage/list-files/
https://docs.amplify.aws/react/build-a-backend/storage/remove-files/
https://docs.amplify.aws/react/build-a-backend/storage/copy-files/
https://docs.amplify.aws/react/build-a-backend/storage/lambda-triggers/
https://docs.amplify.aws/react/build-a-backend/storage/extend-s3-resources/
https://docs.amplify.aws/react/build-a-backend/storage/use-with-custom-s3/
https://docs.amplify.aws/react/build-a-backend/storage/manage-with-amplify-console/ 
https://docs.amplify.aws/react/build-a-backend/storage/reference/ 


UI
https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/



https://docs.amplify.aws/react/build-a-backend/add-aws-services/in-app-messaging/ (In app messageing for Admin and Business Owners)

