import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource"

const backend = defineBackend({
  auth,
  data,
  storage
});

const { cfnIdentityPool } = backend.auth.resources.cfnResources;
cfnIdentityPool.allowUnauthenticatedIdentities = false;

const { groups } = backend.auth.resources;

groups["ADMINS"].role;
groups["CUSTOMERS"].role;
groups["OWNERS"].role;
