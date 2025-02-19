import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";
import { addUserToGroup } from "./add-user-to-group/resource";

const schema = a
  .schema({
    Todo: a
      .model({
        content: a.string(),
      })
      .authorization((allow) => [allow.owner()]),
    
    addUserToGroup: a
    .mutation()
    .arguments({
      id: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group("ADMINS")])
    .handler(a.handler.function(addUserToGroup))
    .returns(a.json()),

    User: a
      .model({
        profileOwner: a.string().required(), // Unique
        username: a.string().required(),
        groupName: a.string().required(),
        firstName: a.string().required(),
        lastName: a.string().required(),
        birthdate: a.date().required(),
        reviews: a.hasMany("Review", "id"), // A user can have many reviews (One-to-Many)
        posts: a.hasMany("Post", "id"), // A user can create multiple detailed posts (One-to-Many)
        subscriptions: a.hasMany("UserBusinessSubscription", "id"), // A user can subscribe to multiple businesses (Many-to-Many)
        businesses: a.hasMany("Business", "id"), // A user can own multiple businesses (One-to-Many)
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
        allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
      ]),

    Post: a
      .model({
        postId: a.string().required(),
        id: a.string().required(), // Connects post to the user who created it
        content: a.string().required(),
        images: a.string().array(),
        createdAt: a.datetime(),
        updatedAt: a.datetime(),
        user: a.belongsTo("User", "id")
      })
      .identifier(['postId'])
      .authorization((allow) => [
        allow.owner().to(["create", "update", "delete"]), // Users can manage their own posts
        allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]), // Admins have full access
      ]),

    UserBusinessSubscription: a
      .model({
        id: a.string().required(), // References the User who subscribes
        businessId: a.string().required(), // References the Business being subscribed to
        subscribedAt: a.datetime().required(), // When the subscription occurred
        user: a.belongsTo("User", "id")
      })
      .identifier(['id', 'businessId'])
      .authorization((allow) => [
        allow.owner().to(["create", "delete"]), // Users can manage their own subscriptions
        allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]), // Admins have full access
        
      ]),

    Business: a
      .model({
        name: a.string().required(),
        businessId: a.string().required(),
        id: a.string().required(),
        description: a.string(),
        category: a.string(),
        address: a.string(),
        city: a.string(),
        state: a.string(),
        zip: a.string(),
        phone: a.string(),
        website: a.string(),
        email: a.string(),
        hours: a.string(),
        images: a.string().array(),
        isMinorityOwned: a.boolean(),
        averageRating: a.float(),
        numberOfRatings: a.integer(),
        createdAt: a.datetime(),
        updatedAt: a.datetime(),
        user: a.belongsTo("User", "id")
      })
      .identifier(['businessId'])
      .authorization((allow) => [
        allow.owner().to(["create", "update", "delete"]), // Business owners can manage their own businesses
        allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]), // Admins have full access
        allow.groups(["OWNER"]).to(["create", "read", "update", "delete"]), // Owner has full access
      ]),
    Review: a
      .model({
        businessId: a.string().required(),
        id: a.string().required(), // Connects to the user who wrote the review
        rating: a.integer().required(),
        text: a.string(),
        images: a.string().array(),
        isPublic: a.boolean(),
        createdAt: a.datetime(),
        updatedAt: a.datetime(),
        user: a.belongsTo("User", "id")
      })
      
      .authorization((allow) => [
        allow.owner().to(["create", "update", "delete"]), // Users can manage their own reviews
        allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]), // Admins have full access
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
