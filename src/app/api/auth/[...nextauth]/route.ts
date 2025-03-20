import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt"; 
import { User } from "next-auth";  
import { SessionStrategy } from "next-auth";  
import { authenticateUser } from "@/lib/auth"; 

export const authOptions: NextAuthOptions = {
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
        console.log('User:', user); 

        if (user) {
          return {
            id: user.id,
            email: user.email,
          };
        } else {
          console.log('Invalid credentials');
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", 
  },
  session: {
    strategy: "jwt" as SessionStrategy, 
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
  debug: true, 
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
