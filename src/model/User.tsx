import mongoose, { Schema, Document } from "mongoose";

// extents document allows it to be used in frontent
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[]; // adds Message interface too here
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is requried"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is requried"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Invalid email"],
  },
  password: {
    type: String,
    required: [true, "Password is requried"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is requried"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is requried"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [messageSchema], // references the message schema
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)

export default UserModel;
