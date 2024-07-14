import UserModel from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          message: "Account Verified, Success",
          success: true,
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          message: "Verification Code expired, Please Signin Again",
          success: false,
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          message: "Error verifying code",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        message: "Error verifying code",
        success: false,
      },
      { status: 500 }
    );
  }
}
