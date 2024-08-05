import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/Models/user";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        identifier: { label: "Username/Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await UserModel.findOne({
          $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
        });

        if (!user) {
          throw new Error("No user found");
        }

        if (user.provider === "google") {
          throw new Error("Please sign in using Google");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (isPasswordCorrect) {
          return user;
        } else {
          throw new Error("Invalid password");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await UserModel.findOne({ email: profile.email });

        if (!existingUser) {
          const newUser = new UserModel({
            email: profile.email,
            username: profile.name,
            password: "test", // This should be handled securely
            wishlist: [],
            expenses: [],
            incomeSources: [],
            monthlyExpenses: [],
            saveTarget: [],
            theme: "light",
            provider: "google",
          });

          await newUser.save();
        }
      }

      return true;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id?.toString(),
          username: token.username,
          email: token.email,
          theme: token?.theme,
          provider: token?.provider,
        };
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.email = user.email;
        token.theme = user?.theme;
        token.provider = user?.provider;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/logout",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
