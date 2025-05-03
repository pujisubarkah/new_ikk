// /pages/api/auth/[...nextauth].ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, Session, DefaultSession, User } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";

// Enhanced type declarations
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    status: string;
    username: string; // Harus konsisten
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      status: string;
      username: string; // Harus konsisten
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    status: string;
    username: string; // Harus konsisten
  }
}


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username (NIP)", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password harus diisi");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
            include: { role_user: true }
          });

          if (!user) {
            throw new Error("User tidak ditemukan");
          }

          // Verify password with bcrypt
          if (!user.password) {
            throw new Error("Password is missing for the user");
          }

          const passwordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordValid) {
            throw new Error("Password salah");
          }

          // Ensure username is always returned
          if (!user.username) {
            throw new Error("Username is missing for the user");
          }

          // Return user data without password
          return {
            id: user.id.toString(),
            name: user.name || "",
            role: user.role_user?.role_id?.toString() || '',
            status: user.status || "",
            username: user.username
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.username = token.username;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
