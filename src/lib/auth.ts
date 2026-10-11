
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(mongoUri);

const db = client.db("ajker-bazar-dor");

const baseURL =
  process.env.BETTER_AUTH_URL ||
  "http://localhost:3000";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

export const auth = betterAuth({
  // Authentication server URL
  baseURL,

  // Secret for signing authentication data
  secret: process.env.BETTER_AUTH_SECRET,

  // Allowed application origins
  trustedOrigins: [
    "http://localhost:3000",
    baseURL,
  ],

  // MongoDB Atlas
  database: mongodbAdapter(db, {
    client,
  }),

  // Email/password authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // User profile
  user: {
    changeEmail: {
      enabled: false,
    },
  },

  // Allow authenticated users to link accounts
  account: {
    accountLinking: {
      enabled: true,

      // Keep your working Google account linking
      trustedProviders: ["google"],
    },
  },

  // Google and GitHub authentication
  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,

            // Request basic profile information
            scope: [
              "openid",
              "email",
              "profile",
            ],
          },
        }
      : {}),

    ...(githubClientId && githubClientSecret
      ? {
          github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,

            // Request GitHub profile and email
            scope: [
              "read:user",
              "user:email",
            ],
          },
        }
      : {}),
  },
});
