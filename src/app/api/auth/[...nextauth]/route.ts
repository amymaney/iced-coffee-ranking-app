import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // Your Prisma client

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    {
      id: "microsoft",
      name: "Microsoft",
      type: "oauth",
      wellKnown: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      idToken: true,
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.id = token.id;
        session.email = token.email;
      }
      return session;
    },
    async signIn({ account, profile }) {
      try {
        if (account?.provider === "microsoft" || account?.provider === "google") {
          // Use `findFirst` to query by provider and providerAccountId
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
            include: {
              user: true, // Include user to retrieve associated user data
            },
          });
    
          if (existingAccount) {
            // Return true if account exists
            return true;
          } else {
            // Optionally, create a new user if the account is not found
            if (!profile?.email) {
              throw new Error("Email is required to create a new user.");
            }
            const newUser = await prisma.user.create({
              data: {
                email: profile?.email ?? "default@example.com",
                name: profile?.name,
                accounts: {
                  create: [
                    {
                      provider: account.provider,
                      providerAccountId: account.providerAccountId,
                      type: account.type,
                    },
                  ],
                },
              },
            });
            return true; // Proceed with sign-in
          }
        }
        return true; // Proceed with sign-in for other providers
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false; // Return false if there's an error
      }
    }
    
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
