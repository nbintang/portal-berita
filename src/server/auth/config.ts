import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { type User } from "@prisma/client";
import { env } from "@/env";

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
// server/auth/auth.config.ts

export const authConfig = {
  providers: [],
  session: { strategy: "jwt", maxAge: 60 * 60, updateAge: 60 * 60 }, // WAJIB untuk edge
  pages: {
    newUser: "/register",
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.includes("/api/auth/callback/email"))
        return `${baseUrl}/register`;
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
} satisfies NextAuthConfig;
