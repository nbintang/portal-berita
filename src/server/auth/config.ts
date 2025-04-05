import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import { db } from "@/server/db";
import { Prisma, type User } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { env } from "@/env";
import { sendVerificationRequest, generateVerificationToken } from "@/lib/mail";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      image: string;
      email: string;
      role: User["role"];
    } & DefaultSession["user"];
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
export const authConfig = {
  pages: {
    newUser: "/register",
  },
  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_SERVER_FROM,
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
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  callbacks: {
    signIn: async ({ account, user }) => {
      if (account?.provider === "email" && !user.name) return true;
      return true;
    },
    session: async ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        role: "READER",
        id: user.id,
      },
    }),
    redirect: async ({ url, baseUrl }) => {
      if (url.includes("/api/auth/callback/email"))  return `${baseUrl}/register`;
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
} satisfies NextAuthConfig;
