import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    access: string;
    refresh: string;
    profile_picture?: string | null;
  }

  interface Session {
    user: User;
    access: string;
    refresh: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    access: string;
    refresh: string;
    profile_picture?: string | null;
  }
}
