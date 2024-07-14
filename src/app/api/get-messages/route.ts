import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request){

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
    
    // this converts string to mongoose object
    const userId = new mongoose.Types.ObjectId(user._id)

    console.log("This is user id from mongoose", userId)

    try {
        const user = await UserModel.aggregate([
            { $match: {id: userId} },
            { $unwind: '$messages' },
            { $sort: {'message.createdAt': -1} },
            { $group: {_id: '$_id', messages: {$push:'$messages'}} }
        ])

        if(!user || user.length === 0){
            return Response.json(
                {
                  message: `No user found`,
                  success: false,
                },
                {
                  status: 404,
                })
        }

        console.log("AGRREGATE PIPLINE USER: " , user)
        console.log("AGRREGATE PIPLINE USER: " , user[0].messages)


        return Response.json(
            {
              message: `USer Found`,
              success: true,
              messages: user[0].messages
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