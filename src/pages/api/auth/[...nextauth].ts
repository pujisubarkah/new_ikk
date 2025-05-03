// /pages/api/auth/[...nextauth].ts

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username (NIP)", type: "text" }, // Ganti email dengan username
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validasi username dan password
        const user = await prisma.user.findUnique({
          where: { username: credentials?.username || "" } as any // Cari user berdasarkan username
        });
        
        // Validasi password (gunakan hash di produksi!)
        if (user && user.password === credentials?.password) {
          return {
            ...user,
            id: user.id.toString(), // Convert id to string
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.username = token.username; // Tambahkan username ke session
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.username = user.username; // Simpan username di JWT
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);