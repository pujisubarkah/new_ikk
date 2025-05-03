// types/next-auth.d.ts

declare module "next-auth" {
  interface Session {
    user: {
      username?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role_user?: {
        role: {
          name: string;
        };
      };
    };
  }

  interface User {
    username?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string | null;
  }
}
