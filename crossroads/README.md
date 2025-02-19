# Crossroads Backend Development  

## Overview  
This repository contains the backend infrastructure for the Crossroads platform, built using AWS Amplify. It includes:  

- **Authentication**: User sign-up, sign-in, and role-based access control (RBAC).  
- **Data**: Models for businesses, reviews, and user data.  
- **Authorization**: Permissions for different user groups (Admins, Customers, Business Owners).  

---

## Local Development  
_(Our IAM works finally 🎉)_  

---

## Styling Resources  
- [Master Styling Guide](https://ui.docs.amplify.aws/)  
- [Auth Styling Guide](https://ui.docs.amplify.aws/react/connected-components/authenticator/customization)  

---

## Authentication & User Groups  

### User Groups & Permissions  
Crossroads uses [AWS Cognito User Groups](https://docs.amplify.aws/react/build-a-backend/auth/concepts/user-groups/) to manage roles and restrict access.  

| Role              | Permissions                                             |
|-------------------|---------------------------------------------------------|
| **ADMINS**        | Full access to all businesses & users                   |
| **BUSINESS OWNERS** | Manage their own business listings, reviews & promotions |
| **CUSTOMERS** _(Default)_ | Can view businesses & write reviews              |

- Upon confirmation, users are **automatically assigned** the role of Customer. [More info](https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/)  
- Guest accounts are **disabled** for now. Should signed-in users have default access? [Discussion](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/)  
- Admins can [manage users](https://docs.amplify.aws/react/build-a-backend/auth/manage-users/with-admin-actions/)  

#### Authorization Rules  
- [Auth Rules](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/)  
- [Group-Based Access](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/)  

---

## Data Modeling  

### User Data Model  
- Uses [user attributes](https://docs.amplify.aws/react/build-a-backend/auth/concepts/user-attributes/) to track user info.  
- Upon confirmation, we [validate attributes](https://docs.amplify.aws/react/build-a-backend/functions/examples/user-attribute-validation/) and [create a user profile record](https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/).  

#### Relationships & Fields  
- [Modeling Relationships](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)  
- [Adding Fields](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)  
- [Identifiers](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/)  
- [Secondary Indexes](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/)  

#### Writing & Querying Data  
- [Write Data](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/#write-data-to-your-backend)  
- [Read Data](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/#read-data-from-your-backend)  
- [Subscribe to Updates](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/#subscribe-to-real-time-updates)  
- [CRUD Operations](https://docs.amplify.aws/react/build-a-backend/data/mutate-data/)  
- [Querying Data](https://docs.amplify.aws/react/build-a-backend/data/query-data/)  
- [Real-time Updates](https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/)  
- [Data Logging](https://docs.amplify.aws/react/build-a-backend/data/enable-logging/)  

#### Custom Business Logic  
- [Custom Logic](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)  

---

## Storage  
- [Set Up Storage](https://docs.amplify.aws/react/build-a-backend/storage/set-up-storage/)  
- [Working with Files](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)  
- [Storage Authorization](https://docs.amplify.aws/react/build-a-backend/storage/authorization/)  
- [Uploading Files](https://docs.amplify.aws/react/build-a-backend/storage/upload-files/)  
- [Downloading Files](https://docs.amplify.aws/react/build-a-backend/storage/download-files/)  
- [Managing Files](https://docs.amplify.aws/react/build-a-backend/storage/manage-with-amplify-console/)  

---

## Additional Resources  

### Authentication  
- [Additional Login Methods](https://docs.amplify.aws/react/build-a-backend/auth/concepts/)  
- [Managing Users in Amplify Console](https://docs.amplify.aws/react/build-a-backend/auth/manage-users/with-amplify-console/)  
- [Granting Access to Auth Resources](https://docs.amplify.aws/react/build-a-backend/auth/grant-access-to-auth-resources/)  
- [Device Management](https://docs.amplify.aws/react/build-a-backend/auth/manage-users/manage-devices/)  
- [Auth API Reference](https://docs.amplify.aws/react/build-a-backend/auth/reference/)  

### UI & UX Enhancements  
- [Optimistic UI Updates](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)  
- [In-App Messaging for Admins & Business Owners](https://docs.amplify.aws/react/build-a-backend/add-aws-services/in-app-messaging/)  

### Potential Features  
- [Custom Messages (e.g., user verification emails)](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/)  
