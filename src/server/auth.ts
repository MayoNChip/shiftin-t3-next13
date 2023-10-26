import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  DefaultUser,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface IUser extends DefaultUser {
    id: string;
    email: string;
    name: string;
    image: string;
    configured: boolean;
  }
  interface Session extends DefaultSession {
    user: IUser & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn: async ({ user, profile, account }) => {
      if (account?.provider === "google") {
        //check if user is in your database
        console.log("google provider login");
        const userInDB = await db.user.findUnique({
          where: {
            email: profile?.email!,
          },
        });
        console.log("user", userInDB);
        if (!userInDB) {
          //add your user in DB here with profile data (profile.email, profile.name)
          console.log("no user was found, adding user to db");
          if (!profile?.email) return false;
          try {
            const addedUserRes = await db.user.create({
              data: {
                email: profile?.email,
                name: profile?.name,
                image: profile?.image,
              },
            });

            console.log(addedUserRes);
          } catch (error) {
            console.log("add user error", error);
            return false;
          }
          return true;
        }
        return true;
      }
      return true;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
