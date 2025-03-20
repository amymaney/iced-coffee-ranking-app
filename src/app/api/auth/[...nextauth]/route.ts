import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt"; // Importing the JWT type from NextAuth
import { User } from "next-auth";  // Importing the User type from NextAuth
import { SessionStrategy } from "next-auth";  // Importing SessionStrategy
import { authenticateUser } from "@/lib/auth"; // ✅ Only import, don't redefine

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        if (!email || !password) {
          return null;
        }

        const user = await authenticateUser(email, password);

        if (user) {
          return {
            id: String(user.id), // Ensure the `id` is a string
            email: user.email,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Custom sign-in page path
  },
  session: {
    strategy: "jwt" as SessionStrategy, // Ensuring the strategy is typed correctly
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.id = token.id;
      session.email = token.email;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
