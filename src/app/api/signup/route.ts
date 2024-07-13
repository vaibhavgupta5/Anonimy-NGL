import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import SendVerificationEmail from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserUsername) {
      return Response.json(
        {
          success: false,
          message: "User Already exists",
        },
        {
          status: 400,
        }
      );
    }

    const verifyCode = (Math.floor(Math.random() * 100000) + 100000).toString();

    const existingUserEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingUserEmail) {
      if (existingUserEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)

        existingUserEmail.password = hashedPassword

        existingUserEmail.verifyCode = verifyCode

        existingUserEmail.verifyCodeExpiry = new Date( Date.now() + 3600000);

       await existingUserEmail.save()

      }
    } 
    else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save(); 
    }

    //send email
    const emailResponse = await SendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "Failed to send email",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Success! Verification Code sent on Email",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in registering user", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user",
      },
      {
        status: 500,
      }
    );
  }
}
