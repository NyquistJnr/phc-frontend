import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        try {
          const res = await fetch(`${baseUrl}/api/v1/auth/login/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data?.status === "success" && data?.data) {
            return {
              id: data.data.user.id,
              email: data.data.user.email,
              first_name: data.data.user.first_name,
              last_name: data.data.user.last_name,
              role: data.data.user.role,
              profile_picture: data.data.user.profile_picture,
              access: data.data.access,
              refresh: data.data.refresh,
            };
          }
          throw new Error(data?.message || "Authentication failed");
        } catch (error: any) {
          throw new Error(
            error.message || "Failed to contact the authentication server.",
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.role = user.role;
        token.profile_picture = user.profile_picture;
        token.access = user.access;
        token.refresh = user.refresh;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        first_name: token.first_name as string,
        last_name: token.last_name as string,
        role: token.role as string,
        profile_picture: token.profile_picture as string | null,
        access: token.access as string,
        refresh: token.refresh as string,
      } as any;

      session.access = token.access as string;
      session.refresh = token.refresh as string;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "RItS50/LCcZFrpHpdt77aTZqyAweqJyuKtK6+3QwO1kBJdSbHVkNGq2JeN4=",
};
