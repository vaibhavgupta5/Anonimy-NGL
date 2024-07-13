import { NextAuthOptions } from "next-auth";
// import { CredentialsProvider } from "next-auth/providers;
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (user.isVerified) {
            throw new Error("Please Verify your account first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Password Wrong");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.isVerified = token.isVerified;
        session.user.isAcceptionMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptionMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
