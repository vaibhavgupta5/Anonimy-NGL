import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();

  const { username, content } = await req.json();
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          message: `No user found`,
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    if(!user.isAcceptingMessage){
        
        return Response.json(
            {
              message: `User is not accepting messages`,
              success: false,
            },
            {
              status: 401,
            })
    }

    const newMessage = {
        content,
        createdAt: new Date()
    }
    user.messages.push(newMessage as Message)

    await user.save()

    
 
        return Response.json(
            {
              message: `Message Sent!`,
              success: true,
            },
            {
              status: 200,
            })
   

  } catch (error) {
    return Response.json(
      {
        message: `Authentication failed`,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
