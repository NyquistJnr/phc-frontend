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

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
            // Mapping the backend payload to the NextAuth user structure.
            return {
              id: data.data.user.id,
              email: data.data.user.email,
              first_name: data.data.user.first_name,
              last_name: data.data.user.last_name,
              role: data.data.user.role,
              access: data.data.access,
              refresh: data.data.refresh,
            };
          }

          // In case the request finishes but isn't authenticated, pass backend error if present
          throw new Error(data?.message || "Authentication failed");
        } catch (error: any) {
          throw new Error(error.message || "Failed to contact the authentication server.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // User is only available on sign-in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.role = user.role;
        token.access = user.access;
        token.refresh = user.refresh;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        first_name: token.first_name,
        last_name: token.last_name,
        role: token.role,
        access: token.access, // optionally expose here or directly under session
        refresh: token.refresh,
      } as any;
      
      session.access = token.access;
      session.refresh = token.refresh;
      
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days (Matches NextAuth default)
  },
  pages: {
    signIn: "/login", // Custom sign-in route
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development", // REMEMBER to set NextAuth secret in ENV
};
