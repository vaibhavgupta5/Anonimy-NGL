import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        message: `Authentication failed`,
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          message: `No user, failed`,
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        message: `Message Acceptence updated successfully `,
        success: true,
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: `Authentication failed`,
        success: false,
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        message: `Authentication failed`,
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  const userId = user._id;
  try {
    const userFound = await UserModel.findById(userId);

    if (!userFound) {
      return Response.json(
        {
          message: `No user found`,
          success: false,
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        message: `Accepting messages:`,
        success: true,
        isAcceptingMessages: userFound.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: `Authentication failed`,
        success: false,
      },
      {
        status: 400,
      }
    );
  }
}
