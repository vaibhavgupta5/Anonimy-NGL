import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}

export async function dbConnect() : Promise <void>{
    if(connection.isConnected){
        console.log("Already connected")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        connection.isConnected = db.connections[0].readyState

        console.log(db)

        console.log("DB CONNECTED")
    } catch (error) {
        console.log("DB CONNECTION FAILED")
        process.exit()
    }
}