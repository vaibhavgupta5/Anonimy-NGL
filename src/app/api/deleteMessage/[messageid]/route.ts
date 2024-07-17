import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request , {params}:{params: {messageid: string}}){


    const messageId = params.messageid
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session.user){
        return Response.json(
            {
              message: `Authentication failed`,
              success: false,
            },
            {
              status: 400,
            })
    }
    
    try {
      const newMessage = await UserModel.updateOne({
        _id: user._id},
        {$pull: {message: {_id: messageId}}}
      )

      if(newMessage.modifiedCount === 0){
        return Response.json(
          {
            message: `Failed to Delete Message`,
            success: false,
          },
          {
            status: 400,
          })
      }

      return Response.json(
        {
          message: `Message Deleted😃`,
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
        })
    }
   
}