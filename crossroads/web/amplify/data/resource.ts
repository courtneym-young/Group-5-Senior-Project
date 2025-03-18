import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";
import { addUserToGroup } from "./add-user-to-group/resource";

const schema = a
  .schema({
    addUserToGroup: a
    .mutation()
    .arguments({
      id: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group("ADMINS")])
    .handler(a.handler.function(addUserToGroup))
    .returns(a.json()),

    // User object
    User: a
      .model({
        profileOwner: a.string().required(), // Unique
        profilePhoto: a.string(), // URL to profile photo in S3
        username: a.string().required(), // chosen username
        groupName: a.string().required(), // the group the user is assigned to 
        firstName: a.string().required(), //  first name
        lastName: a.string().required(), // last name 
        birthdate: a.date().required(), //  birthdate 
        reviews: a.hasMany("Review", "userId"), // A user can have many reviews (One-to-Many)
        businessOwnerPosts: a.hasMany("BusinessOwnerPost", "userId"), // A user can create multiple detailed posts (One-to-Many)
        subscriptions: a.hasMany("UserBusinessSubscription", "userId"), // A user can subscribe to multiple businesses (Many-to-Many)
        businesses: a.hasMany("Business", "userId"), // A user can own multiple businesses (One-to-Many)
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
        allow.owner().to(["create", "read", "update"]),
        allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
      ]),

    // Users can subscribe to specific businesses.
    UserBusinessSubscription: a
      .model({
        userId: a.string().required(), // References the user who subscribes
        businessId: a.string().required(), // References the id of the business being subscribed to
        subscribedAt: a.datetime().required(), // Timestamp of when the subscription occurred
        user: a.belongsTo("User", "userId"), // Relate to user
        business: a.belongsTo("Business", "businessId") // Relate to the business
      })
      .authorization((allow) => [
        allow.owner().to(["create", "delete"]), // Users can manage their own subscriptions
        allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]), // Admins have full access
        allow.groups(["OWNERS"]).to(["create", "read", "update", "delete"]), // Owner has full access
        allow.groups(["CUSTOMERS"]).to(["create", "read", "update", "delete"]), // Customer has full access
      ]),

    BusinessOwnerPost: a
      .model({
        userId: a.string().required(), // References the user who created the post
        businessId: a.string().required(), // References the business the post is for
        content: a.string().required(),
        images: a.string().array(),
        createdAt: a.datetime(),
        updatedAt: a.datetime(),
        user: a.belongsTo("User", "userId"), // Relate to user who created it
        business: a.belongsTo("Business", "businessId") // Relate to the business
      })
      .authorization((allow) => [
        allow.owner().to(["create", "update", "delete"]), // Users can manage their own posts
        allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]), // Admins have full access
        allow.groups(["OWNERS"]).to(["create", "read", "update", "delete"]), // Owner has full access
        allow.groups(["CUSTOMERS"]).to(["create", "read", "update", "delete"]), // Customer has full access
      ]),

    
    // Business data 
    Business: a
      .model({
        name: a.string().required(), // Business name 
        userId: a.string().required(), // ID of the user that owns the business
        description: a.string(), // Short business description
        category: a.string().array(), // Array of categories 
        location: a.customType({ // Location custom type
          streetAddress: a.string(), // Street Address
          secondaryAddress: a.string(), // Secondary Address
          city: a.string(), // City
          state: a.string(), // State
          zip: a.string(), // Zip code 
        }),
        phone: a.phone(), // Phone
        website: a.url(), // Website url
        email: a.email(), // Business email 
        hours: a.string(), // Business hours 
        profilePhoto: a.string(), // link to business profile
        isMinorityOwned: a.boolean(), // Business minority owned
        status: a.enum(['PENDING_REVIEW', 'FLAGGED', 'VERIFIED']), // Status enum
        averageRating: a.float(), // Business average rating
        createdAt: a.datetime(), // CreatedAt timestamp
        updatedAt: a.datetime(), // UpdatedAt timestamp
        user: a.belongsTo("User", "userId"), // Connected user that belongs
        businessOwnerPosts: a.hasMany("BusinessOwnerPost", "businessId"), // Business can have many posts
        reviews: a.hasMany("Review", "businessId"), // Business can have many reviews
        subscribers: a.hasMany("UserBusinessSubscription", "businessId") // Business can have many subscribers
      })
      .authorization((allow) => [
        allow.owner().to(["create", "update", "delete"]), // Business owners can manage their own businesses
        allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]), // Admins have full access
        allow.groups(["OWNERS"]).to(["create", "read", "update", "delete"]), // Owner has full access
        allow.groups(["CUSTOMERS"]).to(["create", "read", "update", "delete"]), // Customer has full access
      ]),
    Review: a
      .model({
        businessId: a.string().required(),
        userId: a.string().required(), // Connects to the user who wrote the review
        rating: a.integer().required(),
        text: a.string(),
        images: a.string().array(),
        isPublic: a.boolean(),
        createdAt: a.datetime(),
        updatedAt: a.datetime(),
        user: a.belongsTo("User", "userId"), // Relate to user who wrote the review
        business: a.belongsTo("Business", "businessId") // Relate to the business being reviewed
      })
      
      .authorization((allow) => [
        allow.owner().to(["create", "update", "delete"]), // Users can manage their own reviews
        allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]), // Admins have full access
        allow.groups(["OWNERS"]).to(["create", "read", "update", "delete"]), // Owner has full access
        allow.groups(["CUSTOMERS"]).to(["create", "read", "update", "delete"]), // Customer has full access
      ]),
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});