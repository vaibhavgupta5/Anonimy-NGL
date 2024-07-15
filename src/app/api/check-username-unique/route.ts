import UserModel from "@/model/User";
import { z } from "zod";
import { dbConnect } from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signupSchema";


export async function GET(req: Request, res: Response) {

  const UsernameQuerySchema = z.object({
    username: usernameValidation,
  });
  

  // if(req.method !== "GET"){
  //     return Response.json(
  //         {
  //             message: `Only POST request accepted`,
  //             success: false
  //         },
  //         {status:404}
  //     )
  // }

  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate with zod

    const validatedQuery = UsernameQuerySchema.safeParse(queryParam);


    if (!validatedQuery.success) {
      const usernameError =
        validatedQuery.error.format().username?._errors || [];

      return Response.json(
        {
          message: `Username already exists: ${usernameError}`,
          success: false,
        },
        { status: 400 }
      );
    }

    const { username } = validatedQuery.data;

    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        {
          message: `Username is alreay taken`,
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        message: `Username exists`,
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Error in checking username",
        success: false,
      },
      { status: 500 }
    );
  }
}
