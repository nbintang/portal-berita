import NextAuth from "next-auth";
import { cache } from "react";
import EmailProvider from "next-auth/providers/email";
import { env } from "@/env";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "../db";
import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    providers:[
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
    ],
    adapter:PrismaAdapter(db)
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
